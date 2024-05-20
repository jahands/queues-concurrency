import PQueue from 'p-queue';

export default {
	// Our fetch handler is invoked on a HTTP request: we can send a message to a queue
	// during (or after) a request.
	// https://developers.cloudflare.com/queues/platform/javascript-apis/#producer
	async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(req.url);
		if (url.pathname === '/add') {
			const pq = new PQueue({ concurrency: 6 });
			for (let i = 0; i < 100; i++) {
				pq.add(() =>
					env.MY_QUEUE.send({
						id: crypto.randomUUID(),
					})
				);
			}
			await pq.onIdle();
			return new Response('Sent message to the queue');
		}
		return new Response('not found', { status: 404 });
	},
	// The queue handler is invoked when a batch of messages is ready to be delivered
	// https://developers.cloudflare.com/queues/platform/javascript-apis/#messagebatch
	async queue(batch: MessageBatch<Error>, env: Env): Promise<void> {
		// A queue consumer can make requests to other endpoints on the Internet,
		// write to R2 object storage, query a D1 Database, and much more.
		const start = Date.now();
		const promises: Array<Promise<any>> = [];
		for (const message of batch.messages) {
			promises.push(
				(async () => {
					const res = await fetch('https://cftest.dev/sleep/10'); // 10 seconds
					if (res.ok) {
						await res.arrayBuffer()
					} else {
						console.log('Error fetching sleep: ', await res.text())
					}
				})()
			);
		}
		await Promise.all(promises);
		const end = Date.now();
		console.log(`processed ${batch.messages.length} messages in ${(end - start) / 1000} seconds`);
	},
};
