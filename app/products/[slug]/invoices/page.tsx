"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import { useParams } from "next/navigation";

export default function InvoicesPage() {
  const { slug } = useParams();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [slug]);

  const load = async () => {
    const res = await axios.get(`/api/invoices/list?slug=${slug}`);
    setData(res.data);
    setLoading(false);
  };

  return (
    <Layout>
      <h1>Invoices</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        data.map((i) => <div key={i.id}>{i.clientEmail}</div>)
      )}
    </Layout>
  );
}