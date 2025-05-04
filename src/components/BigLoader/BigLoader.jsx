const BigLoader = () => {
  return (
    <div
      className='d-flex justify-content-center align-items-center'
      style={{ minHeight: '60vh' }}
    >
      <div className='spinner-border text-primary' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </div>
    </div>
  );
};

export default BigLoader;
