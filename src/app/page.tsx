'use client'

import React, { useEffect, useState } from "react"

import type { Article, ListResponse } from "@/types/article";

import { client } from "@/components/libs/microcms";
import SwitchBtns from '@/components/atoms/SwitchBtns'
import Articlelist from "@/components/organisms/ArticleList";

const Home: React.FC = () => {
  const [viewType, setViewType] = useState<"list" | "image">("list");
  const [data, setData] = useState<ListResponse<Article> | null>(null);

  useEffect(() => {
    client
      .getList<Article>({ endpoint: 'blogs' })
      .then(setData)
  }, [])

  if (!data) return <p>Loading...</p>

  return (
    <>
      <SwitchBtns viewType={viewType} setViewType={setViewType} />
      <Articlelist viewType={viewType} data={data} />
    </>
  );
}

export default Home;
