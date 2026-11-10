# ---- build ----
FROM golang:1.27-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/pocketbase .

# ---- run ----
FROM alpine:3.22
RUN apk add --no-cache ca-certificates tzdata
WORKDIR /pb
COPY --from=build /out/pocketbase /pb/pocketbase
# pb_data must be a persistent volume (database + uploaded files)
VOLUME /pb/pb_data
EXPOSE 8090
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]
