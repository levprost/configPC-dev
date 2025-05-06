FROM node:lts-alpine AS build-stage

ARG MODE=test 
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . . 
COPY .env.${MODE} .env
RUN npm run build

# production stage
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]