# Production PHP container with Node.js for building assets
FROM php:8.3-fpm-alpine

# Install system dependencies including Node.js
RUN apk add --no-cache \
    bash \
    nginx \
    supervisor \
    postgresql-dev \
    redis \
    zip \
    unzip \
    git \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    icu-dev \
    oniguruma-dev \
    nodejs \
    npm \
    linux-headers \
    netcat-openbsd \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_pgsql \
        gd \
        zip \
        intl \
        mbstring \
        bcmath \
        opcache \
        pcntl

# Install Redis extension
RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files first for better Docker layer caching
COPY composer.json composer.lock ./

# 3. CRITICAL: Set environment variable to allow plugins as root
ENV COMPOSER_ALLOW_SUPERUSER=1

# Install PHP dependencies with increased memory limit
RUN COMPOSER_MEMORY_LIMIT=-1 composer install \
    --no-dev \
    # --optimize-autoloader \
    --no-autoloader \
    --no-plugins \
    --no-interaction \
    --no-scripts \
    --verbose \
    --ignore-platform-req=ext-* \
    && composer clear-cache

# Copy npm files
COPY package.json package-lock.json ./
RUN NODE_OPTIONS="--max-old-space-size=2048" npm ci

# Copy application files
COPY . .

# Run the Vite build (Uses the baked-in node_modules)
RUN NODE_OPTIONS="--max-old-space-size=2048" npm run build

# Build Frontend Assets (Production)
# We do this here so the server doesn't have to do it at runtime
# RUN NODE_OPTIONS="--max-old-space-size=2048" npm install && \
#     NODE_OPTIONS="--max-old-space-size=2048" npm run build && \
#     npm prune --production && \
#     rm -rf /root/.npm

# Install Node.js dependencies (will be rebuilt in entrypoint for fresh assets)
# Use increased memory limit for npm install as well
# RUN NODE_OPTIONS="--max-old-space-size=2048" npm ci

# Generate the autoloader WITHOUT running scripts
# We use --no-scripts here too to prevent Artisan from booting 
# because the DB/Redis aren't available during 'docker build'
RUN composer dump-autoload --optimize --no-scripts --no-dev

# Note: Frontend assets will be built in entrypoint.sh to ensure latest changes

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Copy supervisor configuration
COPY docker/php/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy entrypoint script
COPY docker/scripts/entrypoint.sh /usr/local/bin/entrypoint.sh
COPY docker/scripts/check-redis.sh /usr/local/bin/check-redis.sh
RUN chmod +x /usr/local/bin/entrypoint.sh /usr/local/bin/check-redis.sh

# Create log directories and supervisor socket directory
RUN mkdir -p /var/log/supervisor /run/supervisor \
    && chmod 755 /var/log/supervisor /run/supervisor \
    && chown -R www-data:www-data /var/log/supervisor

# PHP-FPM configuration - minimal override to use port 9000
RUN sed -i 's/listen = 127.0.0.1:9000/listen = 0.0.0.0:9000/' /usr/local/etc/php-fpm.d/www.conf \
    && sed -i 's/;catch_workers_output = yes/catch_workers_output = yes/' /usr/local/etc/php-fpm.d/www.conf \
    && sed -i 's/;clear_env = no/clear_env = no/' /usr/local/etc/php-fpm.d/www.conf

# PHP configuration for production
RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.memory_consumption=128" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.interned_strings_buffer=8" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.max_accelerated_files=4000" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.revalidate_freq=2" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.fast_shutdown=1" >> /usr/local/etc/php/conf.d/opcache.ini

# Expose ports
EXPOSE 9000 8080

# Use entrypoint script
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Start supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
