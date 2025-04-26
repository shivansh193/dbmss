export default function Footer() {
    return (
      <footer className="w-full bg-gray-900 text-gray-300 py-12 border-t border-gray-700">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Brand Section */}
            <div>
              <h3 className="text-xl font-semibold text-white">WEHIndia</h3>
              <p className="text-sm mt-2">
                Delivering cutting-edge solutions in bioinformatics, spatial analysis, and omics aggregation.
              </p>
            </div>
  
            {/* Navigation Section */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
              <nav className="space-y-2">
                <a href="/" className="block hover:text-blue-400">Home</a>
                <a href="/signup" className="block hover:text-blue-400">About</a>
                <a href="/signup" className="block hover:text-blue-400">Services</a>
                <a href="/signup" className="block hover:text-blue-400">Contact</a>
              </nav>
            </div>
  
            {/* Services Section */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Our Solutions</h3>
              <nav className="space-y-2">
                <a href="/vendor" className="block hover:text-blue-400">Vendor Platform</a>
                <a href="/signup" className="block hover:text-blue-400">Event Platform</a>
                <a href="/signup" className="block hover:text-blue-400">Explorer</a>
              </nav>
            </div>
  
            {/* Newsletter Section */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>
              <p className="text-sm text-gray-400 mb-4">
                Get the latest news and updates straight to your inbox.
              </p>
              <form className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
  
          {/* Bottom Section */}
          <div className="mt-10 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">© 2025 WEHIndia. All rights reserved.</p>
  
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400">Facebook</a>
              <a href="#" className="hover:text-blue-400">Twitter</a>
              <a href="#" className="hover:text-blue-400">LinkedIn</a>
              <a href="#" className="hover:text-blue-400">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    );
  }
  