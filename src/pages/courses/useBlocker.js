import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

export function useBlocker(blocker, when = true) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!when) return;

    const unblock = navigate((tx) => {
      const { pathname } = location;

      if (pathname !== tx.location.pathname) {
        blocker(() => {
          unblock();
          tx.retry();
        });
      }
    });

    return unblock;
  }, [navigate, blocker, when, location]);
}
