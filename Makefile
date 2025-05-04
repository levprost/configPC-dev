init-publish:
	docker context create configPC-site --docker "host=ssh://root@168.231.80.177"
	docker context use configPC-site
publish:
	docker context use configPC-site
	docker-compose down --rmi all
	docker compose -f ./docker-stack.yml up -d
publish-data:
	docker exec $(shell docker ps --filter "name=^configPC-laravel" --quiet) bash -c "php artisan migrate"
	docker exec $(shell docker ps --filter "name=^configPC-laravel-docker" --quiet) bash -c "php artisan db:seed"