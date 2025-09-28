'use client';

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser } from "../UserProvider"
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfileDropdown() {
  const router = useRouter();
  const { user } = useUser();
  if (!user) return;

  const profileMenu = user.role === 'Tenant' ? [{ label: "Applications", href: '/tenants/applications' }, { label: "Residences", href: '/tenants/residences' }] : [{ label: 'Properties', href: '/managers/properties' },];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline'>
          <span>{user.name.split(' ')[0]}</span>
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 z-[9999]">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/settings')}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/settings')}>
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {profileMenu.map(item => (
            <DropdownMenuItem onClick={() => router.push(item.href)} key={item.label}>{item.label}</DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
