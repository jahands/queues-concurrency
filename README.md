# queues-concurrency

## Setup

```bash
npm install
# Create a queue to use (change in wrangler.toml if a different name is needed)

npx wrangler queues create queue-concurrency-test
```

## Deploy

```bash
npx wrangler deploy
```

## Test

```bash
# Enable wrangler tail to monitor processing time:
npx wrangler tail # in separate terminal

# Send 300+ items to the queue
curl https://queues-concurrency.jhands.workers.dev/add
curl https://queues-concurrency.jhands.workers.dev/add
curl https://queues-concurrency.jhands.workers.dev/add

# Update max_concurrency in wrangler.toml between 1 and 10
# to see how logs slow down.
```
