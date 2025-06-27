import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Send } from "lucide-react";

export default function Contact() {
  return (
    <div id="contact" className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Contact Mission Cosmos
        </h2>
        <p className="text-xl text-gray-300">
          Ready to embark on your cosmic journey? Get in touch!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Contact Form */}
        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Send className="h-6 w-6 text-yellow-400 mr-2" /> Send us a Message
            </CardTitle>
            <CardDescription className="text-gray-400">
              Have questions about space exploration or our interactive experiences? We'd love to hear from you!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              name="contact"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              className="space-y-6"
            >
              {/* Netlify required hidden field */}
              <input type="hidden" name="form-name" value="contact" />

              {/* Honeypot (spam prevention) */}
              <p className="hidden">
                <label>
                  Don’t fill this out if you're human: <input name="bot-field" />
                </label>
              </p>

              <div>
                <Label htmlFor="name" className="text-gray-300">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-gray-400"
                  placeholder="Your name"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-gray-400"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-gray-300">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-gray-400 min-h-[120px]"
                  placeholder="Tell us about your cosmic curiosity..."
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold"
              >
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="space-y-8">
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Get in Touch</CardTitle>
              <CardDescription className="text-gray-400">Connect with our mission control team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Mail className="h-6 w-6 text-blue-400" />
                <div>
                  <p className="text-white font-medium">Email</p>
                  <p className="text-gray-400">missioncosmosinquiry@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin className="h-6 w-6 text-red-400" />
                <div>
                  <p className="text-white font-medium">Location</p>
                  <p className="text-gray-400">Somewhere in the Milky Way Galaxy</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Mission Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-gray-300">
                <p><span className="text-yellow-400">Monday - Sunday:</span> Always available (Orbiting through time zones)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
