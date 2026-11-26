import NowledgeLogo from "@/components/logo/NowledgeLogoLoader";

const Header = () => {
  return (
    <header className="w-full fixed top-0 left-0 z-[100] p-[14px_70px_14px_25px] md:p-[30px_0_0_140px]">
      <div>
        {/* ロゴは案によって高さが違うので、幅だけ決めて高さは中身に合わせる */}
        <h1 className="relative w-[150px] md:w-[200px]">
          {/* ロゴクリックでページを読み込み直し、検索条件をリセットするため、あえて <Link> ではなく <a> を使う */}
          {/* （読み込み直すたびに、ロゴの案も変わる） */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" className="block">
            {/* 読み上げ・検索エンジン向けの見出しの文字（ロゴ自体は飾りとして扱う） */}
            <span className="sr-only">Nowledge</span>
            <NowledgeLogo />
          </a>
        </h1>
      </div>
    </header>
  );
};

export default Header;
