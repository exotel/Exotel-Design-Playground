import { useMemo } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import type { NavigateFunction } from 'react-router-dom'
import {
  Box,
  AppBar as ExoAppBar,
  Icon,
  Navigation,
  useLoadDataByTheme,
  useThemeMode,
  type NavSectionProps,
} from '@exotel-npm-dev/signal-design-system'
import { clearPlaygroundSession } from '../auth/playgroundSession'
// import { BRAND_LOGO } from '../constants/app'
import brandLogoLight from '../assets/exotel-playground-logo-light.svg'
import brandLogoDark from '../assets/exotel-playground-logo-dark.svg'

function buildNavSections(navigate: NavigateFunction): NavSectionProps[] {
  const go = (path: string) => () => navigate(path)

  return [
    {
      items: [
        {
          id: 'home',
          iconName: 'house',
          label: 'Home',
          path: '/',
          openNewPage: false,
          onClick: go('/'),
        },
        {
          id: 'onboarding',
          iconName: 'rocket-launch',
          label: 'Onboarding',
          path: '/onboarding',
          openNewPage: false,
          onClick: go('/onboarding'),
        },
        {
          id: 'example-table',
          iconName: 'columns',
          label: 'Example - Table Page',
          path: '/example-table',
          openNewPage: false,
          onClick: go('/example-table'),
        },
        {
          id: 'closed-interaction',
          iconName: 'columns',
          label: 'Closed Interaction',
          path: '/closed-interaction',
          openNewPage: false,
          onClick: go('/closed-interaction'),
        },
        {
          id: 'date-time',
          iconName: 'calendar-blank',
          label: 'Example - Date & Time',
          path: '/date-time',
          openNewPage: false,
          onClick: go('/date-time'),
        },
        {
          id: 'example-settings',
          iconName: 'gear',
          label: 'Example - Settings',
          path: '/example-settings',
          openNewPage: false,
          onClick: go('/example-settings'),
        },
        {
          id: 'ai-chat',
          iconName: 'sparkle',
          label: 'AI Chat',
          path: '/ai-chat',
          openNewPage: false,
          onClick: go('/ai-chat'),
        },
        {
          id: 'example-node',
          iconName: 'layout',
          label: 'Example - Node Flow',
          path: '/example-node',
          openNewPage: false,
          onClick: go('/example-node'),
        },
        {
          id: 'example-4',
          iconName: 'chart-bar',
          label: 'Example 4',
          openNewPage: false,
          children: [
            {
              id: 'example-4-child-1',
              iconName: 'circle',
              label: 'Child 1',
              path: '/example-4/child-1',
              openNewPage: false,
              onClick: go('/example-4/child-1'),
            },
            {
              id: 'example-4-child-2',
              iconName: 'circle',
              label: 'Child 2',
              path: '/example-4/child-2',
              openNewPage: false,
              onClick: go('/example-4/child-2'),
            },
          ],
        },
      ],
    },
    {
      label: 'APPS',
      items: [
        {
          id: 'app-1',
          iconName: 'squares-four',
          label: 'App 1',
          path: '/app-1',
          openNewPage: true,
          onClick: go('/app-1'),
        },
        {
          id: 'app-2',
          iconName: 'squares-four',
          label: 'App 2',
          path: '/app-2',
          openNewPage: true,
          onClick: go('/app-2'),
        },
      ],
    },
  ]
}

export function AppLayout() {
  const navigate = useNavigate()
  const { mode, setMode } = useThemeMode()
  const brandLogo = useLoadDataByTheme(brandLogoDark, brandLogoLight);

  const navSections = useMemo(() => buildNavSections(navigate), [navigate])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ExoAppBar
        appLauncherType="default"
        appLauncherIconName="squares-four"
        appLauncherProducts={[
          {
            id: 'design-playground',
            name: 'Design Playground',
            section: 'Products',
            icon: <Icon name="squares-four" size="sm" />,
            onProductClick: () => {},
          },
          {
            id: 'contact-center',
            name: 'Contact Center',
            section: 'Products',
            icon: <Icon name="headset" size="sm" />,
            onProductClick: () => {},
          },
          {
            id: 'campaigns',
            name: 'Campaigns',
            section: 'Products',
            icon: <Icon name="chart-bar" size="sm" />,
            onProductClick: () => {},
          },
        ]}
        brandLogo={<img src={brandLogo} alt="Exotel Playground Logo" style={{ width: 'unset', height: 'unset' }} />}
        brandLogoStyle={{ width: 'unset', height: 'unset' }}
        avatarName="OP User"
        avatarMenuGroups={[
          {
            id: 'primary',
            items: [
              { id: 'item1', label: 'Menu Item 1', onClick: () => console.log('item1') },
              { id: 'item2', label: 'Menu Item 2', onClick: () => console.log('item2') },
              { id: 'item3', label: 'Menu Item 3', onClick: () => console.log('item3') },
            ],
          },
          {
            id: 'secondary',
            items: [
              { id: 'error-logs', label: 'Send Error Logs', onClick: () => console.log('error-logs') },
              { id: 'shortcuts', label: 'Keyboard Shortcuts', onClick: () => console.log('shortcuts') },
            ],
          },
        ]}
        avatarFooterInfo={[{ label: 'Version', value: '1.0.0' }]}
        avatarSelectedTheme={mode || 'system'}
        onAvatarThemeChange={setMode}
        onAvatarLogout={() => {
          clearPlaygroundSession()
          navigate('/sign-in', { replace: true })
        }}
        onNotificationClick={() => {}}
      />
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Navigation items={navSections} />
        <Box
          sx={{
            flex: 1,
            bgcolor: 'surface.elevation0',
            p: 1,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
