FROM node as frontent

RUN mkdir /src
WORKDIR /src
COPY ./frontend /src
RUN npm install && npm run build

FROM golang:latest AS backend

RUN mkdir /src
WORKDIR /src
COPY . /src

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o application ./main.go

FROM scratch
COPY --from=frontent /src/build /app/frontend/build
COPY --from=backend /src/application /app/application
WORKDIR /app
ENTRYPOINT ["/app/application"]