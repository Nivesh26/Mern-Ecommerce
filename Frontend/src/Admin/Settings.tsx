import { useState } from 'react'
import { toast } from 'react-toastify'
import Navbar from '../AdminComponent/Navbar'
import { updatePassword } from '../api/auth'
import { getStoreStatus, updateStoreStatus } from '../api/store'
import { useStoreStatus } from '../context/StoreStatusContext'

const Settings = () => {
  const { storeOpen, refreshStoreStatus } = useStoreStatus()
  const [storeStatusLoading, setStoreStatusLoading] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    newOrders: true,
    lowStock: true,
    newMessages: true,
    weeklyReport: false
  })

  const handleToggleStore = async () => {
    const newOpen = !storeOpen
    setStoreStatusLoading(true)
    try {
      await updateStoreStatus(newOpen)
      await refreshStoreStatus()
      toast.success(newOpen ? 'Store is now open.' : 'Store is now closed.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update store status.')
    } finally {
      setStoreStatusLoading(false)
    }
  }

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))
    setPasswordError('')
  }

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }
    setPasswordError('')
    setChangingPassword(true)
    try {
      await updatePassword(passwordForm.currentPassword, passwordForm.newPassword)
      setPasswordSuccess(true)
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowChangePassword(false)
      toast.success('Password updated successfully.')
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update password'
      setPasswordError(message)
      toast.error(message)
    } finally {
      setChangingPassword(false)
    }
  }

  const inputBase =
    'w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors'

  const EyeIcon = ({ show }: { show: boolean }) =>
    show ? (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      </svg>
    ) : (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="ml-64 min-h-screen p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage your store details and preferences.</p>
        </header>

        <div className="space-y-6">
          {/* Notifications */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
                <p className="text-sm text-gray-500">Choose which email alerts you receive.</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {[
                { key: 'newOrders' as const, label: 'New orders', desc: 'Get notified when a new order is placed.' },
                { key: 'lowStock' as const, label: 'Low stock alerts', desc: 'Alert when product quantity is low.' },
                { key: 'newMessages' as const, label: 'New messages', desc: 'Notify when a customer sends a message.' },
                { key: 'weeklyReport' as const, label: 'Weekly report', desc: 'Summary of sales and orders every week.' }
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-800">{label}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={notifications[key]}
                    onClick={() => toggleNotification(key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                      notifications[key] ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${
                        notifications[key] ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                      style={{ marginTop: 2 }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Security */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Security</h2>
                <p className="text-sm text-gray-500">Manage your admin account password.</p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">Change your admin login password to keep your account secure.</p>
              {passwordSuccess && (
                <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-green-50 text-green-800 text-sm">
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Password updated successfully.
                </div>
              )}
              {!showChangePassword ? (
                <button
                  type="button"
                  onClick={() => setShowChangePassword(true)}
                  className="px-5 py-2.5 border border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors"
                >
                  Change password
                </button>
              ) : (
                <div className="flex justify-center">
                  <form onSubmit={handleChangePasswordSubmit} className="space-y-4 w-full max-w-md">
                  <div>
                    <label htmlFor="adminCurrentPassword" className="block text-sm font-medium text-gray-700 mb-1.5">Current password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        id="adminCurrentPassword"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        className={`${inputBase} pr-11`}
                        placeholder="Enter current password"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded"
                        aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                      >
                        <EyeIcon show={showCurrentPassword} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="adminNewPassword" className="block text-sm font-medium text-gray-700 mb-1.5">New password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        id="adminNewPassword"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className={`${inputBase} pr-11`}
                        placeholder="At least 6 characters"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded"
                        aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                      >
                        <EyeIcon show={showNewPassword} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="adminConfirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">Confirm new password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="adminConfirmPassword"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className={`${inputBase} pr-11`}
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        <EyeIcon show={showConfirmPassword} />
                      </button>
                    </div>
                  </div>
                  {passwordError && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {passwordError}
                    </div>
                  )}
                  <div className="flex gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {changingPassword ? 'Updating…' : 'Update password'}
                    </button>
                    <button
                      type="button"
                      disabled={changingPassword}
                      onClick={() => {
                        setShowChangePassword(false)
                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
                        setPasswordError('')
                      }}
                      className="px-5 py-2.5 border border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
                </div>
              )}
            </div>
          </section>

          {/* Temporary close store */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Temporary close store</h2>
                <p className="text-sm text-gray-500">When enabled, customers will see a closed message and cannot place orders.</p>
              </div>
            </div>
            <div className="p-6">
              <button
                type="button"
                onClick={handleToggleStore}
                disabled={storeStatusLoading}
                className={
                  storeOpen
                    ? 'w-full px-5 py-2.5 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-70'
                    : 'w-full px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-70'
                }
              >
                {storeStatusLoading ? 'Updating…' : storeOpen ? 'Close store' : 'Open store'}
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Settings
