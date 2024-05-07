import CircularProgress from '@mui/material/CircularProgress';

// This Loader component is very common component
// Don`t remove default export
// Don`t remove inline styles. It was made for component lightness
export default function Loader() {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress />
    </div>
  );
}
