import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { SignOut } from "phosphor-react";

export const AuthShowcase: React.FC<{ sessionData: Session }> = ({
  sessionData,
}) => {
  return (
    <section className="z-10 flex flex-row items-center justify-center gap-4 rounded-full py-3 px-5 hover:cursor-pointer hover:backdrop-brightness-75">
      {sessionData && <span>{sessionData.user?.name}</span>}
      <div className="dropdown-bottom dropdown-end dropdown z-10">
        <div tabIndex={0} className="rounded-full">
          <Image
            alt={`${
              sessionData ? sessionData.user?.name : "Random user"
            }'s avatar`}
            width="32"
            height="32"
            src={
              sessionData
                ? (sessionData.user?.image as string)
                : "/user-placeholder.jpg"
            }
            className="avatar max-h-48 min-w-max rounded-full"
          />
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu rounded-box bg-gray-800 p-2"
        >
          <li>
            <button
              className="btn flex min-w-max gap-2 rounded-lg px-5 py-3 font-semibold text-white no-underline transition hover:bg-gray-900"
              onClick={() => signOut()}
            >
              <SignOut size={20} weight="bold" />
              Sign out
            </button>
          </li>
        </ul>
      </div>
    </section>
  );
};
