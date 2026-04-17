export default function Loading() {
  return (
    <div className="product-detail-container">
      <div>
        <div className="image-container" style={{ width: 400, height: 400, backgroundColor: '#ebebeb', borderRadius: 15 }} />
      </div>
      <div className="product-detail-desc">
        <h1>Loading...</h1>
        <p>Please wait while we fetch the product details.</p>
      </div>
    </div>
  );
}
