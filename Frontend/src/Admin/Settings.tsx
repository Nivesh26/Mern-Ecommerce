import Navbar from '../AdminComponent/Navbar'

const Settings = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="ml-64 min-h-screen p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-600 mb-6">Manage your store settings and preferences.</p>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <p className="text-gray-500 text-sm">Settings options will appear here.</p>
        </div>
      </main>
    </div>
  )
}

export default Settings
