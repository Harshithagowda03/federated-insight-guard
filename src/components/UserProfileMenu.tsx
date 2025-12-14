/**
 * FedSecure AI - User Profile Dropdown Menu
 * 
 * Displays user avatar with dropdown for account settings,
 * preferences, and logout functionality.
 */

import { User, Settings, Shield, Bell, Moon, Sun, LogOut } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface UserProfileMenuProps {
  onLogout: () => void;
}

export const UserProfileMenu = ({ onLogout }: UserProfileMenuProps) => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return 'U';
    const parts = user.email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return user.email.slice(0, 2).toUpperCase();
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    // Theme switching would be implemented here
    toast.success(checked ? 'Dark mode enabled' : 'Light mode enabled');
  };

  const handleNotificationsToggle = (checked: boolean) => {
    setNotifications(checked);
    toast.success(checked ? 'Notifications enabled' : 'Notifications disabled');
  };

  const handleSettingsClick = () => {
    toast.info('Settings panel coming soon');
  };

  const handleSecurityClick = () => {
    toast.info('Security settings coming soon');
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full p-1 hover:bg-accent/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50">
          <Avatar className="h-8 w-8 border-2 border-primary/30">
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm font-medium">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground hidden md:inline max-w-32 truncate">
            {user.email}
          </span>
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-64 bg-card border border-border shadow-xl z-50" 
        align="end"
        sideOffset={8}
      >
        {/* User Info Header */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3 py-1">
            <Avatar className="h-10 w-10 border-2 border-primary/30">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-foreground">
                {user.name || user.email?.split('@')[0]}
              </span>
              <span className="text-xs text-muted-foreground truncate max-w-40">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {/* Account Settings Group */}
        <DropdownMenuGroup>
          <DropdownMenuItem 
            className="cursor-pointer gap-3"
            onClick={handleSettingsClick}
          >
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span>Account Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="cursor-pointer gap-3"
            onClick={handleSecurityClick}
          >
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span>Security</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        {/* Preferences Group */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal px-2">
            Preferences
          </DropdownMenuLabel>
          
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between px-2 py-2 hover:bg-accent rounded-sm">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Sun className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm">Dark Mode</span>
            </div>
            <Switch 
              checked={darkMode} 
              onCheckedChange={handleDarkModeToggle}
              className="scale-75"
            />
          </div>
          
          {/* Notifications Toggle */}
          <div className="flex items-center justify-between px-2 py-2 hover:bg-accent rounded-sm">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Notifications</span>
            </div>
            <Switch 
              checked={notifications} 
              onCheckedChange={handleNotificationsToggle}
              className="scale-75"
            />
          </div>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        {/* Logout */}
        <DropdownMenuItem 
          className="cursor-pointer gap-3 text-destructive focus:text-destructive focus:bg-destructive/10"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
