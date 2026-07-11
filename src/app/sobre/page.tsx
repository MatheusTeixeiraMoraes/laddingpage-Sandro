import { SobreBio } from "@/components/SobreBio";
import { GaleriaFotos } from "@/components/GaleriaFotos";
import { DepoimentosVideo } from "@/components/DepoimentosVideo";
import { GoogleReviews } from "@/components/GoogleReviews";
import { RedesSociais } from "@/components/RedesSociais";

export default function SobrePage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-16 px-6 py-16">
      <SobreBio />
      <GaleriaFotos />
      <DepoimentosVideo />
      <GoogleReviews />
      <RedesSociais />
    </div>
  );
}
