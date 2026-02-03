import { Utensils, Facebook, Twitter, Instagram } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function Footer() {
    const { user } = useAuth();
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="bg-orange-600 p-2 rounded-lg">
                                <Utensils className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">FoodCourt</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            Bringing the best local flavors directly to your table. Fresh, fast, and always delicious.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-6">Quick Links</h3>
                        <ul className="space-y-4 text-gray-400">
                            <li><Link href="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
                            <li><Link href="/marketplace" className="hover:text-orange-500 transition-colors">Menu</Link></li>
                            <li><Link href="/signup" className="hover:text-orange-500 transition-colors">Join as Partner</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-6">Contact</h3>
                        <ul className="space-y-4 text-gray-400">
                            <li>support@foodcourt.com</li>
                            <li>+254 (722) 222-222</li>
                            <li>Mombasa Road, NextGen Mall</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-6">Follow Us</h3>
                        <div className="flex gap-4">
                            <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-orange-600 transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-orange-600 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-orange-600 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
                    <span>&copy; {new Date().getFullYear()} Food Court App. All rights reserved.</span>
                    {user && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full border border-gray-700">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs text-gray-300">Logged in as: <span className="font-bold text-white">{user.name || user.owner_name || user.first_name || "User"}</span></span>
                        </div>
                    )}
                </div>
            </div>
        </footer>
    );
}