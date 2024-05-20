# queues-concurrency

## Setup

```shell
npm install
# Create a queue to use (change in wrangler.toml if a different name is needed)

npx wrangler queues create queue-concurrency-test
```

## Deploy

```shell
npx wrangler deploy
```

## Test

```shell
# Enable wrangler tail to monitor processing time:
npx wrangler tail # in separate terminal

# Send 1000 items to the queue
curl https://queues-concurrency.jhands.workers.dev/add
curl https://queues-concurrency.jhands.workers.dev/add

# Update max_concurrency in wrangler.toml between 1 and 10
# to see how logs slow down.
```

### Example logs with 1 concurrency:

```
Queue queue-concurrency-test (6 messages) - Ok @ 5/19/2024, 10:11:51 PM
  (log) processed 6 messages in 10.058 seconds
Queue queue-concurrency-test (6 messages) - Ok @ 5/19/2024, 10:11:51 PM
  (log) processed 6 messages in 10.058 seconds
Queue queue-concurrency-test (6 messages) - Ok @ 5/19/2024, 10:11:51 PM
  (log) processed 6 messages in 10.074 seconds
Queue queue-concurrency-test (6 messages) - Ok @ 5/19/2024, 10:11:51 PM
  (log) processed 6 messages in 10.032 seconds
Queue queue-concurrency-test (6 messages) - Ok @ 5/19/2024, 10:12:01 PM
  (log) processed 6 messages in 10.045 seconds
Queue queue-concurrency-test (6 messages) - Ok @ 5/19/2024, 10:12:01 PM
  (log) processed 6 messages in 10.061 seconds
Queue queue-concurrency-test (6 messages) - Ok @ 5/19/2024, 10:12:01 PM
  (log) processed 6 messages in 10.042 seconds
Queue queue-concurrency-test (6 messages) - Ok @ 5/19/2024, 10:12:01 PM
```

### Example logs with 10 concurrency:

It seems to vary (guessing sometimes it's using a new isolate?)
But very clearly is sharing concurrency limits between multiple
concurrent invocations:

```
  (log) processed 6 messages in 40.522 seconds
Queue queue-concurrency-test (6 messages) - Ok @ 5/19/2024, 10:22:32 PM
  (log) processed 6 messages in 40.616 seconds
Queue queue-concurrency-test (6 messages) - Ok @ 5/19/2024, 10:22:42 PM
  (log) processed 6 messages in 40.492 seconds
Queue queue-concurrency-test (6 messages) - Ok @ 5/19/2024, 10:23:02 PM
  (log) processed 6 messages in 40.598 seconds
Queue queue-concurrency-test (6 messages) - Ok @ 5/19/2024, 10:23:12 PM
  (log) processed 6 messages in 40.554 seconds
Queue queue-concurrency-test (6 messages) - Ok @ 5/19/2024, 10:23:33 PM
  (log) processed 6 messages in 40.536 seconds
Queue queue-concurrency-test (6 messages) - Ok @ 5/19/2024, 10:23:43 PM
  (log) processed 6 messages in 40.429 seconds
Queue queue-concurrency-test (6 messages) - Ok @ 5/19/2024, 10:24:04 PM
  (log) processed 6 messages in 40.587 seconds
Queue queue-concurrency-test (6 messages) - Ok @ 5/19/2024, 10:24:14 PM
  (log) processed 6 messages in 40.298 seconds
Queue queue-concurrency-test (6 messages) - Ok @ 5/19/2024, 10:24:44 PM
```
