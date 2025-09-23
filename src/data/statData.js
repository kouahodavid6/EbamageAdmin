import { Building2, MapPin } from "lucide-react";

const statData = (totalVilles, totalCommunes) => [
  {
    title: "Total Villes",
    value: totalVilles,
    icon: Building2,
    bgColor: "bg-pink-500",
  },
  {
    title: "Total Communes",
    value: totalCommunes,
    icon: MapPin,
    bgColor: "bg-blue-500",
  },
  // {
  //   title: "Moyenne Communes/Ville",
  //   value: totalVilles > 0 ? (totalCommunes / totalVilles).toFixed(1) : "0",
  //   icon: MapPin,
  //   bgColor: "bg-green-500",
  // },
];

export default statData;
