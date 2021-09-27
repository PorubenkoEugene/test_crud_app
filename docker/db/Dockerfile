FROM mysql:8.0

ENV MYSQL_ROOT_PASSWORD root
ENV MYSQL_DATABASE test_crud_db
#ENV MYSQL_USER root
#ENV MYSQL_PASSWORD root
ENV MYSQL_ALLOW_EMPTY_PASSWORD: "yes"


ADD setup.sql /docker-entrypoint-initdb.d
