const OrdersTable = ({ orders }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Processing': return 'bg-blue-100 text-blue-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-4 px-4 font-bold text-gray-700 text-sm">Order ID</th>
            <th className="text-left py-4 px-4 font-bold text-gray-700 text-sm">Customer</th>
            <th className="text-left py-4 px-4 font-bold text-gray-700 text-sm">Product</th>
            <th className="text-left py-4 px-4 font-bold text-gray-700 text-sm">Date</th>
            <th className="text-left py-4 px-4 font-bold text-gray-700 text-sm">Total</th>
            <th className="text-left py-4 px-4 font-bold text-gray-700 text-sm">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-4 px-4 font-bold text-gray-900 text-sm">{order.id}</td>
              <td className="py-4 px-4 font-semibold text-gray-700 text-sm">{order.customer}</td>
              <td className="py-4 px-4 text-gray-600 text-sm">{order.product}</td>
              <td className="py-4 px-4 text-gray-600 text-sm">{order.date}</td>
              <td className="py-4 px-4 font-bold text-gray-900 text-sm">{order.total}</td>
              <td className="py-4 px-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;