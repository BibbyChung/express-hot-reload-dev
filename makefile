
workspace-up:
	docker run --rm -it -w /app -v $(PWD):/app -p 9000:9000 node:12.14-alpine /bin/sh
