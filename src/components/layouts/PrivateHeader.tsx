import { auth } from "@/auth";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Setting from "./Setting";

export default async function PrivateHeader() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("不正なアクセスです。");
  return (
    <header className="border-b bg-gray-800">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/dashboard"
                className="font-bold text-xl text-white hover:bg-gray-700
                hover:text-white rounded-md px-4 py-2 transition-colors duration-200"
              >
                管理ページ
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Setting session={session} />
      </div>
    </header>
  );
}
