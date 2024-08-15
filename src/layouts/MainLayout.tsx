import { APP_ROUTES } from "@/appRoutes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { clearUser } from "@/state/userReducer";
import { UserState } from "@/types";
import {
  CalendarPlus2,
  LayoutDashboard,
  Menu,
  Package2,
  Stethoscope,
  UserIcon,
  Users,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const navItemIconClass = "h-4 w-4";

const linkToTitle = {
  "/dashboard": "Dashboard",
  "/patients": "Patients",
  "/doctors": "Doctors",
  "/appointments": "Appointments",
};

const navItems = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard className={navItemIconClass} />,
    link: APP_ROUTES.DASHBOARD,
  },
  {
    label: "Patients",
    icon: <Users className={navItemIconClass} />,
    link: APP_ROUTES.PATIENTS,
  },
  {
    label: "Users",
    icon: <Stethoscope className={navItemIconClass} />,
    link: APP_ROUTES.USERS,
  },
  {
    label: "Appointments",
    icon: <CalendarPlus2 className={navItemIconClass} />,
    link: APP_ROUTES.APPOINTMENTS,
  },
  {
    label: "Medicines",
    icon: <Stethoscope className={navItemIconClass} />,
    link: APP_ROUTES.MEDICATION,
  },
  {
    label: "Ailments",
    icon: <CalendarPlus2 className={navItemIconClass} />,
    link: APP_ROUTES.AILMENTS,
  },
];

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: { user: UserState }) => state.user.user);
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-4">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">HMS Admin</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map((item) => (
                <Link
                  to={item.link}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary  ${
                    item.link === location.pathname
                      ? "bg-gray-200"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                {navItems.map((item) => (
                  <Link
                    to={item.link}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary "
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold md:text-2xl">
              {linkToTitle[location.pathname as keyof typeof linkToTitle]}
            </h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={user?.signedUrl}
                    alt="image"
                    className="object-fit "
                  />
                  <AvatarFallback className="hover:cursor-pointer">
                    <UserIcon className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate(APP_ROUTES.PROFILE)}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  dispatch(clearUser());
                  navigate(APP_ROUTES.LOGIN);
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
