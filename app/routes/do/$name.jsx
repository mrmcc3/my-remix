import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export async function loader({ params: { name }, request, context: { env, cf } }) {
  const { colo, city } = cf;
  const cfRay = request.headers.get("cf-ray");

  if (!name) throw new Response("no name provided");

  // fetch some data from a unique durable object
  const doId = env.EXAMPLE.idFromName(name);
  const res = await env.EXAMPLE.get(doId).fetch(
    "https://michael.workers.dev/example-do",
    {
      method: "POST",
      body: JSON.stringify({ colo }),
    }
  );
  const data = await res.json();

  return json({
    colo,
    city,
    cfRay,
    name,
    ...data,
  });
}

export function meta() {
  return {
    title: "DO Example",
    description: "Reading from durable objects",
  };
}

const spanStyle = "bg-gray-100 px-2 py-0.5 rounded font-semibold font-mono";

export default function DO() {
  const { city, colo, cfRay, name, currentColo, creationColo, counts } =
    useLoaderData();
  return (
    <>
      <p>
        You requested this page from{" "}
        <span className={spanStyle}>{city || colo}</span>.
      </p>
      <p>
        A cloudflare worker in the <span className={spanStyle}>{colo}</span>{" "}
        datacenter rendered this page.
      </p>
      <p>
        The worker made a request to the Durable Object named{" "}
        <span className={spanStyle}>{name}</span> which is running in the
        <span className={spanStyle}>{currentColo}</span> datacenter and was
        first created in
        <span className={spanStyle}>{creationColo}</span>.
      </p>

      <p>
        Below is a list of request counts to the DO grouped by worker
        datacenter:
      </p>
      <ul>
        {Object.entries(counts).map(([colo, count]) => (
          <li key={colo}>
            <span className={spanStyle}>
              {colo.substring(5)} - {count}
            </span>
          </li>
        ))}
      </ul>

      <p>
        request id is <span className={spanStyle}>{cfRay}</span>
      </p>
    </>
  );
}
