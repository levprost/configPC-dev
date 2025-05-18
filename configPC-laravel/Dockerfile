FROM php:8.3-apache

ARG MODE=test
ENV MODE=${MODE}
ENV COMPOSER_ALLOW_SUPERUSER=1

# Установка расширений PHP
RUN apt-get update && apt-get install -y \
    libfreetype-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    zlib1g-dev \
    libzip-dev \
    unzip \
    git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd zip mysqli pdo pdo_mysql

# Копирование исходников
COPY . /var/www/app
WORKDIR /var/www/app

# Подключение нужного .env
COPY .env.${MODE} .env

# Apache конфиг
COPY vhost.conf /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite headers env dir mime authz_host authz_core

# Права
RUN chown -R www-data:www-data /var/www/app \
    && chmod -R 775 /var/www/app/storage

# Установка Composer
COPY --from=composer:2.6.5 /usr/bin/composer /usr/local/bin/composer

# Установка зависимостей
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Laravel команды (опционально — можно перенести в entrypoint)
RUN php artisan key:generate \
    && php artisan config:clear \
    && php artisan storage:link || true
