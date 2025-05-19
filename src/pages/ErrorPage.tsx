import { Link } from "react-router";
import { useEffect, useState } from "react";
import { SiPokemon } from "react-icons/si";
import { MdCatchingPokemon } from "react-icons/md";
import Button from "../components/Button";

export default function ErrorPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 2000); // simulate loading
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex flex-col items-center justify-center text-center text-white p-6">
      {loading ? (
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <MdCatchingPokemon className="text-red-500 font-pokemon w-20 h-20 animate-spin-slow" />
          <p className="text-xl text-yellow-300">Finding missing Pokémon...</p>
        </div>
      ) : (
        <>
          <SiPokemon className="text-yellow-400 w-16 h-16 mb-4 drop-shadow-md" />
          <h1 className="text-5xl font-extrabold font-pokemon-hollow text-yellow-300 mb-2">
            404 - Pokémon Not Found!
          </h1>
          <p className="text-blue-100 mb-6 font-pokemon">
            The path you followed is a wild one! Let's head back to safety.
          </p>
          <Link
            to="/"
          >
            <Button containerClass="inline-block bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-3 transition duration-300" title="Take me Home"/>
          </Link>
        </>
      )}
    </div>
  );
}
