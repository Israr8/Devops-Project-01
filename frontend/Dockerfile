FROM node:18 AS build

WORKDIR /app


COPY package*.json ./


RUN npm install 


COPY . .

# Pass the correct backend API URL as a build argument

ARG REACT_APP_API_URL=http://172.17.143.236:30001/api
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

RUN npm run build

#Serve the React application using Nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html


EXPOSE 80


CMD ["nginx", "-g", "daemon off;"]

