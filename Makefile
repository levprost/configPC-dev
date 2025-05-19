dev:
	make -j 2 artisan-serve vuejs
seed:
	cd configPC-laravel && php artisan migrate:fresh --seed
artisan-serve:
	cd configPC-laravel && php artisan serve
vuejs:
	cd configpc-react && npm run dev
test:
	cd configPC-laravel && php artisan migrate:fresh --seed
	cd ..
	cd Test-api && npm run test
init-publish:
	docker context create configPC-site --docker "host=ssh://root@168.231.80.177"
	docker context use configPC-site
publish:
	docker context use configPC-site
	docker-compose down --remove-orphans
	docker system prune -a
	docker login https://ghcr.io
	docker compose -f ./docker-stack.yml up -d
publish-data:
    docker exec $(docker ps --filter "name=configpc-laravel-docker-1" -q) sh -c "php artisan migrate:fresh --seed"
	