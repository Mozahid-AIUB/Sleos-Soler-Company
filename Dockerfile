# Production image for Coolify (or any Docker host).
# Uses Next.js standalone output: small image, no dev dependencies.
# Includes Payload CMS (admin at /admin): needs DATABASE_URI + PAYLOAD_SECRET at runtime
# and a persistent volume at /app/media for uploaded files (see docs/DEPLOY.md (CMS section)).

FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
# sharp (image processing, used by Next and Payload) needs libc6-compat on alpine.
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# Build-time values. Coolify passes variables marked "Build Variable" as build args.
# Defaults are harmless placeholders so `next build` never fails on a missing value;
# the real secret/DB are only read at runtime (ARG values are not copied to the run image).
# If any page queries the CMS while building, set a REAL DATABASE_URI as a build variable
# (the DB must then be reachable from the build) or make those pages dynamic - see docs/DEPLOY.md (CMS section).
ARG PAYLOAD_SECRET=build-time-placeholder-not-used-at-runtime
ARG DATABASE_URI=postgres://placeholder:placeholder@127.0.0.1:5432/placeholder
ARG NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_GA_ID
ARG NEXT_PUBLIC_META_PIXEL_ID
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET     DATABASE_URI=$DATABASE_URI     NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL     NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID     NEXT_PUBLIC_META_PIXEL_ID=$NEXT_PUBLIC_META_PIXEL_ID
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS run
# libc6-compat: needed by sharp's prebuilt libvips binaries on alpine (musl).
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001 -G nodejs
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public
# Uploads (Payload media). Mount a persistent volume here; on first use of an empty
# named volume Docker copies this ownership, so nextjs can write to it.
RUN mkdir -p /app/media && chown nextjs:nodejs /app/media
VOLUME ["/app/media"]
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/en >/dev/null || exit 1
CMD ["node", "server.js"]
