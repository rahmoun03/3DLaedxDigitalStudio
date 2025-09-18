import { useSections } from "@/hooks/useSectionsStore";
import HomeScene from "@/pages/LaedxDigitalStudio/scene";
import HiveXperience from "@/pages/HiveXperience/scene";
// import NoveXperience from "@/pages/NoveXperience/scene";

export default function SceneManager() {
  const { products } = useSections();

  const activeProduct = products.find((p) => p.active)?.name;

  console.log('Active Product : ', activeProduct);
  
  return (
    <>
        <HomeScene />
        {/* <HiveXperience /> */}
    </>
  )
}
