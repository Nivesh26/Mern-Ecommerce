import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../User Components/Header'
import Footer from '../User Components/Footer'
import { getUser, clearAuth } from '../api/auth'

const defaultProfile = {
  fullName: 'Sita Sharma',
  email: 'sita@example.com',
  phoneNumber: '+977 9801001001'
}

const Profile = () => {
  const navigate = useNavigate()
  const savedUser = getUser()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(() =>
    savedUser
      ? { fullName: savedUser.fullName, email: savedUser.email, phoneNumber: savedUser.phoneNumber }
      : defaultProfile
  )
  const [form, setForm] = useState(profile)

  useEffect(() => {
    if (savedUser) {
      setProfile({ fullName: savedUser.fullName, email: savedUser.email, phoneNumber: savedUser.phoneNumber })
      setForm({ fullName: savedUser.fullName, email: savedUser.email, phoneNumber: savedUser.phoneNumber })
    }
  }, [])

  const handleLogout = () => {
    clearAuth()
    navigate('/')
  }
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setProfile({ ...form })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setForm(profile)
    setIsEditing(false)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))
    setPasswordError('')
  }

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
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
    setPasswordSuccess(true)
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setShowChangePassword(false)
    setTimeout(() => setPasswordSuccess(false), 3000)
  }

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(false)
    window.location.href = '/'
  }

  const inputBase =
    'w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white transition-colors'

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-10 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">My Profile</h1>
            <p className="mt-2 text-gray-600">Manage your personal information and security settings.</p>
          </header>

          {/* Personal information */}
          <section className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50/30 px-6 py-8 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center text-3xl font-bold text-white shadow-md ring-4 ring-white">
                    {profile.fullName.charAt(0)}
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-semibold text-gray-900">{profile.fullName}</h2>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Personal information</h3>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-5">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      className={inputBase}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className={inputBase}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1.5">Phone number</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      className={inputBase}
                      placeholder="+977 9800000000"
                    />
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 flex-1 justify-center bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save changes
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-5 py-3 border border-green-600 text-green-600 rounded-xl font-medium hover:bg-green-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <dl className="grid gap-4 sm:grid-cols-1">
                  <div className="py-3 border-b border-gray-100 last:border-0">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">Full name</dt>
                    <dd className="mt-1.5 text-gray-900 font-medium">{profile.fullName}</dd>
                  </div>
                  <div className="py-3 border-b border-gray-100 last:border-0">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">Email</dt>
                    <dd className="mt-1.5 text-gray-900">{profile.email}</dd>
                  </div>
                  <div className="py-3 border-b border-gray-100 last:border-0">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">Phone</dt>
                    <dd className="mt-1.5 text-gray-900">{profile.phoneNumber}</dd>
                  </div>
                </dl>
              )}
            </div>
          </section>

          {/* Change password */}
          <section className="mt-6 bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Password & security</h2>
                <p className="text-sm text-gray-500 mt-0.5">Update your password to keep your account secure. Use at least 6 characters.</p>
              </div>
            </div>
            <div className="p-6">
              {passwordSuccess && (
                <div className="mb-5 flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
                  <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium text-emerald-800">Password updated successfully.</p>
                </div>
              )}
              {!showChangePassword ? (
                <button
                  type="button"
                  onClick={() => setShowChangePassword(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-green-600 text-green-600 rounded-xl font-medium hover:bg-green-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Change password
                </button>
              ) : (
                <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1.5">Current password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        className={`${inputBase} pr-12`}
                        placeholder="Enter current password"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded"
                        aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                      >
                        {showCurrentPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1.5">New password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        id="newPassword"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className={`${inputBase} pr-12`}
                        placeholder="At least 6 characters"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded"
                        aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                      >
                        {showNewPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">Confirm new password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className={`${inputBase} pr-12`}
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
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
                      className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Update password
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowChangePassword(false)
                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
                        setPasswordError('')
                      }}
                      className="px-5 py-2.5 border border-green-600 text-green-600 rounded-xl font-medium hover:bg-green-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>

          {/* Delete account */}
          <section className="mt-6 bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-red-100 bg-red-50/40 flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Delete account</h2>
                <p className="text-sm text-gray-600 mt-0.5">Permanently delete your account and all associated data. This action cannot be undone.</p>
              </div>
            </div>
            <div className="p-6">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete my account
              </button>
            </div>
          </section>

          {/* Log out */}
          <section className="mt-6 bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
            <div className="p-6">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-xl font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Log out
              </button>
            </div>
          </section>

          {/* Delete confirmation modal */}
          {showDeleteConfirm && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
              onClick={() => setShowDeleteConfirm(false)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-modal-title"
            >
              <div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 transition-all duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 id="delete-modal-title" className="text-lg font-semibold text-gray-900">Delete account?</h3>
                    <p className="text-sm text-gray-600 mt-0.5">This cannot be undone.</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Your account and all associated data will be permanently removed. You will need to sign up again to use our services.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
                  >
                    Yes, delete my account
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-3 border border-green-600 text-green-600 rounded-xl font-medium hover:bg-green-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Profile
