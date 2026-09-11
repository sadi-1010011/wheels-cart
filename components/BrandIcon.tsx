import {
  SiAudi, SiBmw, SiMahindra, SiKia, SiFord, SiRenault,
  SiTata, SiMg, SiJeep, SiVolkswagen, SiToyota, SiSuzuki,
} from "react-icons/si";

interface BrandIconProps {
  brand: string;
  className?: string;
}

export const BrandIcon = ({ brand, className }: BrandIconProps) => {
  const cn = className || "w-8 h-8";
  switch (brand.toLowerCase()) {
    case 'audi': return <SiAudi className={cn} />;
    case 'bmw': return <SiBmw className={cn} />;
    case 'mahindra': return <SiMahindra className={cn} />;
    case 'kia': return <SiKia className={cn} />;
    case 'ford': return <SiFord className={cn} />;
    case 'renault': return <SiRenault className={cn} />;
    case 'tata': return <SiTata className={cn} />;
    case 'mg motor': return <SiMg className={cn} />;
    case 'jeep': return <SiJeep className={cn} />;
    case 'volkswagen': return <SiVolkswagen className={cn} />;
    case 'toyota': return <SiToyota className={cn} />;
    case 'maruti': return <SiSuzuki className={cn} />;
    case 'mercedes-benz':
      return <img src="https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg" className={`${cn} object-contain`} alt="Mercedes" />;
    // case 'byd':
    //   return <img src="https://upload.wikimedia.org/wikipedia/commons/e/e2/BYD_Auto_2022_logo.svg" className={`${cn} object-contain`} alt="BYD" />;
    default:
      return <span className={`font-extrabold ${className} flex items-center justify-center text-xl`}>{brand.charAt(0)}</span>;
  }
};
