import { Button, Navbar, NavbarGroup, NavbarHeading } from '@blueprintjs/core';
import { useStore } from '../state/store';

export function AppNavbar() {
  const { dispatch } = useStore();

  return (
    <Navbar>
      <NavbarGroup>
        <NavbarHeading>My Chance</NavbarHeading>
      </NavbarGroup>
      <NavbarGroup align="right">
        <Button
          minimal
          icon="list"
          text="Profiles"
          onClick={() => dispatch({ type: 'NAVIGATE', view: { name: 'list' } })}
        />
        <Button
          minimal
          icon="play"
          text="Play"
          onClick={() => dispatch({ type: 'NAVIGATE', view: { name: 'play', profileId: '' } })}
        />
      </NavbarGroup>
    </Navbar>
  );
}
