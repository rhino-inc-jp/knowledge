import Image from "next/image";

const Footer = () => {
  return (
    <footer className="md:w-[88%] md:my-0 md:mr-[7.2%] md:ml-auto pt-[45px] pb-[25px] md:pt-[70px] md:pb-[75px] max-md:mr-[4.2%]">
      <div className="text-right">
        <p className="inline-block relative w-[80px] h-[15px] md:w-[120px] md:h-[20px]">
          <Image src="/logo_rhino-inc.svg" fill alt="&copy; Rhino Inc." />
        </p>
      </div>
    </footer>
  );
};

export default Footer;
