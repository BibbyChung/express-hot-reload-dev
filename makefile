
workspace-up:
	docker run --rm -it -w /app -v $(PWD):/app -p 3000:3000 node:12.14-alpine /bin/sh
