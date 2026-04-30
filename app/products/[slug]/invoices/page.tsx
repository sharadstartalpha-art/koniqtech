"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import { useParams } from "next/navigation";

export default function InvoicesPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    load();
  }, [slug]);

  const load = async () => {
    try {
      const res = await axios.get(`/api/invoices/list?slug=${slug}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout slug={slug}>
      <h1 className="text-lg font-semibold mb-4">Invoices</h1>

      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No invoices</p>
      ) : (
        data.map((i) => (
          <div key={i.id} className="border p-2 mb-2 rounded">
            {i.clientEmail}
          </div>
        ))
      )}
    </Layout>
  );
}