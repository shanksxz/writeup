import { useState } from 'react'
import { useAuth } from '@/context/useAuth'
import Layout from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback  } from '@/components/ui/avatar'
import { Pencil } from 'lucide-react'

export default function Profile() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState({
    name: `${user.firstName} ${user.lastName}`,
    username: user.username,
    email: user.email,
    bio: 'I love writing and sharing my thoughts with the world.',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedUser(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Updated user:', editedUser)
    setIsEditing(false)
  }

  return (
    <Layout>
      <div className="mx-auto px-4 md:px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback>{
                  editedUser.name.split(" ").map((name) => name[0].toUpperCase()).join("")
                }</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{editedUser.name}</h2>
                <p className="text-gray-500">@{editedUser.username}</p>
                <p className="text-gray-500">{editedUser.email}</p>
              </div>
            </div>
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={editedUser.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={editedUser.username}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={editedUser.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={editedUser.bio}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                </div>
              </form>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-2">Bio</h3>
                <p>{editedUser.bio}</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {isEditing ? (
              <div className="flex justify-end space-x-2 w-full">
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSubmit}>Save Changes</Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Pencil className="w-4 h-4 mr-2" /> Edit Profile
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </Layout>
  )
}
