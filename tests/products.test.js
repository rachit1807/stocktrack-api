import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../src/app.js";
let mongo, id;
const product = {
  name: "Test keyboard",
  sku: "TEST-001",
  category: "Electronics",
  price: 1250,
  quantity: 6,
};
before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  await mongoose.model("Product").init();
});
after(async () => {
  await mongoose.disconnect();
  await mongo?.stop();
});
test("creates, reads, updates and deletes a persisted product", async () => {
  const created = await request(app)
    .post("/api/products")
    .send(product)
    .expect(201);
  id = created.body.data._id;
  assert.equal(created.body.data.reorderLevel, 10);
  assert.ok(created.body.data.createdAt);
  const read = await request(app)
    .get("/api/products/" + id)
    .expect(200);
  assert.equal(read.body.data.name, product.name);
  const list = await request(app).get("/api/products").expect(200);
  assert.equal(list.body.data.length, 1);
  const updated = await request(app)
    .patch("/api/products/" + id)
    .send({ quantity: 9 })
    .expect(200);
  assert.equal(updated.body.data.quantity, 9);
  await request(app)
    .delete("/api/products/" + id)
    .expect(204);
  await request(app)
    .get("/api/products/" + id)
    .expect(404);
});
test("rejects missing fields, invalid categories, negative values and fractional stock", async () => {
  await request(app).post("/api/products").send({}).expect(400);
  for (const change of [
    { category: "Other" },
    { price: -1 },
    { quantity: 1.5 },
    { reorderLevel: 2.5 },
  ])
    await request(app)
      .post("/api/products")
      .send({ ...product, ...change })
      .expect(400);
});
test("rejects duplicate SKU and invalid updates without corrupting data", async () => {
  const p = await request(app).post("/api/products").send(product).expect(201);
  const key = p.body.data._id;
  await request(app).post("/api/products").send(product).expect(409);
  await request(app)
    .patch("/api/products/" + key)
    .send({ quantity: -1 })
    .expect(400);
  await request(app)
    .patch("/api/products/" + key)
    .send({ $unset: { name: 1 } })
    .expect(400);
  await request(app)
    .patch("/api/products/" + key)
    .send({})
    .expect(400);
  const found = await request(app)
    .get("/api/products/" + key)
    .expect(200);
  assert.equal(found.body.data.quantity, 6);
});
test("returns useful errors for malformed and missing IDs", async () => {
  await request(app).get("/api/products/nope").expect(400);
  await request(app)
    .get("/api/products/" + new mongoose.Types.ObjectId())
    .expect(404);
  await request(app).get("/api/missing").expect(404);
});
test("health reports a connected database and frontend is served", async () => {
  await request(app).get("/api/health").expect(200);
  const page = await request(app).get("/").expect(200);
  assert.match(page.text, /Inventory, <em>in order/);
});
