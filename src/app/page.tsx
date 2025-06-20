import React from "react";

import type { Article } from "@/types/article";

import { client } from "@/components/libs/microcms";
import Articlelist from "@/components/organisms/ArticleList";

const Home: React.FC = async () => {
  const data = await client.getList<Article>({
    endpoint: 'blogs',
  });

  return (
    <div>
      <Articlelist data={data} />
    </div>
  );
}

export default Home;
