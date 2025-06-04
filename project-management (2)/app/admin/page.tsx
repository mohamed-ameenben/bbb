"use client"

import { useState } from "react"
import Link from "next/link"
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  Edit,
  FileText,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Send,
  User,
  X
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

// Étapes par défaut pour un nouveau projet
const defaultStages = [
  { id: 1, name: "Premier Rendez-vous", status: "en cours", date: null },
  { id: 2, name: "Devis envoyé", status: "verrouillé", date: null },
  { id: 3, name: "Signature", status: "verrouillé", date: null },
  { id: 4, name: "Upload de fichiers", status: "verrouillé", date: null },
  {
    id: 5,
    name: "Logo/Branding",
    status: "verrouillé",
    date: null,
    feedbackRounds: 0,
    maxFeedbackRounds: 3,
    feedbackDeadline: null,
  },
  { id: 6, name: "Aperçu Figma", status: "verrouillé", date: null },
  { id: 7, name: "Validation finale", status: "verrouillé", date: null },
  { id: 8, name: "Développement", status: "verrouillé", date: null },
  { id: 9, name: "Signalement de bugs", status: "verrouillé", date: null },
  { id: 10, name: "Paiement final", status: "verrouillé", date: null },
  { id: 11, name: "Mise en ligne", status: "verrouillé", date: null },
]

// Données de projets mock pour l'exemple
const projectsData = [
  {
    id: "proj-123",
    name: "Refonte du site web",
    client: "Acme Corp",
    clientEmail: "contact@acmecorp.com",
    startDate: "2024-04-01",
    currentStage: 3,
    stages: [
      { id: 1, name: "Premier Rendez-vous", status: "terminé", date: "2024-04-01" },
      { id: 2, name: "Devis envoyé", status: "terminé", date: "2024-04-03" },
      { id: 3, name: "Signature", status: "en cours", date: "2024-04-05" },
      { id: 4, name: "Upload de fichiers", status: "verrouillé", date: null },
      {
        id: 5,
        name: "Logo/Branding",
        status: "verrouillé",
        date: null,
        feedbackRounds: 0,
        maxFeedbackRounds: 3,
        feedbackDeadline: "2024-04-20",
      },
      { id: 6, name: "Aperçu Figma", status: "verrouillé", date: null },
      { id: 7, name: "Validation finale", status: "verrouillé", date: null },
      { id: 8, name: "Développement", status: "verrouillé", date: null },
      { id: 9, name: "Signalement de bugs", status: "verrouillé", date: null },
      { id: 10, name: "Paiement final", status: "verrouillé", date: null },
      { id: 11, name: "Mise en ligne", status: "verrouillé", date: null },
    ],
    comments: [
      { id: 1, user: "John Doe", text: "Le client a demandé des révisions supplémentaires pour la page d'accueil", date: "2024-04-04" },
      { id: 2, user: "Jane Smith", text: "En attente de signature du contrat", date: "2024-04-05" },
    ],
    isLate: false,
  },
  {
    id: "proj-456",
    name: "Développement d'application mobile",
    client: "TechStart Inc",
    clientEmail: "info@techstart.com",
    startDate: "2024-03-15",
    currentStage: 5,
    stages: [
      { id: 1, name: "Premier Rendez-vous", status: "terminé", date: "2024-03-15" },
      { id: 2, name: "Devis envoyé", status: "terminé", date: "2024-03-17" },
      { id: 3, name: "Signature", status: "terminé", date: "2024-03-20" },
      { id: 4, name: "Upload de fichiers", status: "terminé", date: "2024-03-25" },
      {
        id: 5,
        name: "Logo/Branding",
        status: "en cours",
        date: "2024-03-28",
        feedbackRounds: 2,
        maxFeedbackRounds: 3,
        feedbackDeadline: "2024-04-10",
      },
      { id: 6, name: "Aperçu Figma", status: "verrouillé", date: null },
      { id: 7, name: "Validation finale", status: "verrouillé", date: null },
      { id: 8, name: "Développement", status: "verrouillé", date: null },
      { id: 9, name: "Signalement de bugs", status: "verrouillé", date: null },
      { id: 10, name: "Paiement final", status: "verrouillé", date: null },
      { id: 11, name: "Mise en ligne", status: "verrouillé", date: null },
    ],
    comments: [
      { id: 1, user: "Alex Johnson", text: "Le client a fourni tous les éléments nécessaires", date: "2024-03-26" },
      { id: 2, user: "Sarah Williams", text: "Deuxième retour reçu pour les logos", date: "2024-04-02" },
    ],
    isLate: true,
    lateReason: "Date limite de retour client imminente",
  },
  {
    id: "proj-789",
    name: "Plateforme E-commerce",
    client: "Fashion Boutique",
    clientEmail: "hello@fashionboutique.com",
    startDate: "2024-02-20",
    currentStage: 8,
    stages: [
      { id: 1, name: "Premier Rendez-vous", status: "terminé", date: "2024-02-20" },
      { id: 2, name: "Devis envoyé", status: "terminé", date: "2024-02-22" },
      { id: 3, name: "Signature", status: "terminé", date: "2024-02-25" },
      { id: 4, name: "Upload de fichiers", status: "terminé", date: "2024-03-01" },
      {
        id: 5,
        name: "Logo/Branding",
        status: "terminé",
        date: "2024-03-10",
        feedbackRounds: 3,
        maxFeedbackRounds: 3,
        feedbackDeadline: "2024-03-15",
      },
      { id: 6, name: "Aperçu Figma", status: "terminé", date: "2024-03-20" },
      { id: 7, name: "Validation finale", status: "terminé", date: "2024-03-25" },
      { id: 8, name: "Développement", status: "en cours", date: "2024-03-28" },
      { id: 9, name: "Signalement de bugs", status: "verrouillé", date: null },
      { id: 10, name: "Paiement final", status: "verrouillé", date: null },
      { id: 11, name: "Mise en ligne", status: "verrouillé", date: null },
    ],
    comments: [
      {
        id: 1,
        user: "Michael Brown",
        text: "Développement démarré, livraison estimée sous 2 semaines",
        date: "2024-03-28",
      },
      {
        id: 2,
        user: "Emily Davis",
        text: "Le client a demandé des pages catégories supplémentaires",
        date: "2024-04-01",
      },
    ],
    isLate: false,
  },
]

export default function TableauDeBordAdmin() {
  const [projects, setProjects] = useState(projectsData)
  const [selectedProject, setSelectedProject] = useState(null)
  const [newComment, setNewComment] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [newProject, setNewProject] = useState({
    name: "",
    client: "",
    clientEmail: "",
  })

  // Upload doc & send email state/handlers
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      // Ici, tu pourrais envoyer le fichier à une API/backend si besoin
    }
  };

  const handleSendEmail = () => {
    if (selectedProject) {
      window.open(`mailto:${selectedProject.clientEmail}`, "_blank");
    }
  };

  // Regroupement des projets par étape
  const projectsByStage = {}
  projects.forEach((project) => {
    const currentStageObj = project.stages.find((stage) => stage.id === project.currentStage)
    const stageName = currentStageObj ? currentStageObj.name : "Inconnu"
    if (!projectsByStage[stageName]) {
      projectsByStage[stageName] = []
    }
    projectsByStage[stageName].push(project)
  })

  const handleSelectProject = (project) => {
    setSelectedProject(project)
    setUploadedFile(null)
  }

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedProject) return
    const updatedProjects = projects.map((project) => {
      if (project.id === selectedProject.id) {
        return {
          ...project,
          comments: [
            ...project.comments,
            {
              id: project.comments.length + 1,
              user: "Utilisateur Admin",
              text: newComment,
              date: new Date().toISOString().split("T")[0],
            },
          ],
        }
      }
      return project
    })
    setProjects(updatedProjects)
    setSelectedProject(updatedProjects.find((p) => p.id === selectedProject.id))
    setNewComment("")
  }

  const handleCompleteStage = () => {
    if (!selectedProject) return
    const updatedProjects = projects.map((project) => {
      if (project.id === selectedProject.id) {
        const nextStageId = project.currentStage + 1
        const updatedStages = project.stages.map((stage) => {
          if (stage.id === project.currentStage) {
            return { ...stage, status: "terminé", date: new Date().toISOString().split("T")[0] }
          }
          if (stage.id === nextStageId) {
            return { ...stage, status: "en cours", date: new Date().toISOString().split("T")[0] }
          }
          return stage
        })

        return {
          ...project,
          currentStage: nextStageId,
          stages: updatedStages,
        }
      }
      return project
    })
    setProjects(updatedProjects)
    setSelectedProject(updatedProjects.find((p) => p.id === selectedProject.id))
  }

  const handleOpenModal = () => setShowModal(true)
  const handleCloseModal = () => {
    setShowModal(false)
    setNewProject({ name: "", client: "", clientEmail: "" })
  }

  const handleChangeNewProject = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value })
  }

  const handleCreateProject = () => {
    if (!newProject.name.trim() || !newProject.client.trim() || !newProject.clientEmail.trim()) return
    const today = new Date().toISOString().split("T")[0]
    const stages = defaultStages.map((stage) =>
      stage.id === 1
        ? { ...stage, status: "en cours", date: today }
        : { ...stage, status: "verrouillé", date: null }
    )
    const newProj = {
      id: `proj-${Date.now()}`,
      name: newProject.name,
      client: newProject.client,
      clientEmail: newProject.clientEmail,
      startDate: today,
      currentStage: 1,
      stages,
      comments: [],
      isLate: false,
    }
    setProjects([...projects, newProj])
    setShowModal(false)
    setNewProject({ name: "", client: "", clientEmail: "" })
    setSelectedProject(newProj)
    setUploadedFile(null)
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* --- MODAL Ajouter Projet --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={handleCloseModal}
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold text-brand-dark mb-4">Ajouter un nouveau projet</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-brand-dark">Nom du projet</label>
                <Input
                  name="name"
                  value={newProject.name}
                  onChange={handleChangeNewProject}
                  placeholder="ex : Site marketing"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-brand-dark">Nom du client</label>
                <Input
                  name="client"
                  value={newProject.client}
                  onChange={handleChangeNewProject}
                  placeholder="ex : Ma Société"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-brand-dark">Email du client</label>
                <Input
                  name="clientEmail"
                  type="email"
                  value={newProject.clientEmail}
                  onChange={handleChangeNewProject}
                  placeholder="ex : client@email.com"
                />
              </div>
              <Button
                className="w-full bg-brand-yellow text-brand-dark hover:bg-brand-yellow/90 mt-2"
                onClick={handleCreateProject}
              >
                <Plus className="mr-2 h-4 w-4" /> Créer le projet
              </Button>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 w-full bg-brand-dark text-white">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center text-white hover:text-brand-yellow">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Link>
          <div className="ml-auto flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-brand-yellow hover:bg-transparent"
            >
              Aide
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-brand-yellow hover:bg-transparent"
            >
              Paramètres
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="Admin" />
              <AvatarFallback className="bg-brand-blue text-white">AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <main className="flex-1 py-8 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-brand-dark">Tableau de bord Admin</h1>
                <p className="text-gray-500">Gérez tous les projets clients et suivez leur avancement</p>
              </div>
              <Button
                className="bg-brand-yellow text-brand-dark hover:bg-brand-yellow/90"
                onClick={handleOpenModal}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nouveau projet
              </Button>
            </div>

            {/* Alertes pour projets en retard */}
            {projects.some((p) => p.isLate) && (
              <Alert className="border-brand-pink bg-brand-pink/10">
                <AlertCircle className="h-4 w-4 text-brand-pink" />
                <AlertTitle className="text-brand-dark">Attention requise</AlertTitle>
                <AlertDescription className="text-gray-600">
                  {projects.filter((p) => p.isLate).length} projet(s) nécessitent une attention immédiate à cause d'échéances proches.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Kanban */}
              <div className="lg:col-span-2">
                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader className="border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-brand-dark">Kanban des projets</CardTitle>
                      <Button
                        size="sm"
                        className="bg-brand-yellow text-brand-dark hover:bg-brand-yellow/90"
                        onClick={handleOpenModal}
                      >
                        <Plus className="mr-2 h-3 w-3" />
                        Ajouter un projet
                      </Button>
                    </div>
                    <CardDescription>Voir tous les projets selon leur étape actuelle</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {Object.keys(projectsByStage).map((stageName) => (
                        <div key={stageName} className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-brand-dark">{stageName}</h3>
                            <Badge variant="outline" className="bg-gray-50 text-brand-dark border-gray-200">
                              {projectsByStage[stageName].length}
                            </Badge>
                          </div>
                          <div className="space-y-3">
                            {projectsByStage[stageName].map((project) => (
                              <div
                                key={project.id}
                                className={`cursor-pointer rounded-md border p-3 transition-all duration-200 hover:shadow-md ${
                                  selectedProject?.id === project.id
                                    ? "border-brand-blue bg-brand-blue/5"
                                    : "border-gray-200"
                                } ${project.isLate ? "border-brand-pink bg-brand-pink/5" : ""}`}
                                onClick={() => handleSelectProject(project)}
                              >
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-brand-dark">{project.name}</h4>
                                  {project.isLate && (
                                    <Badge className="ml-2 bg-brand-pink text-brand-dark">
                                      <Clock className="mr-1 h-3 w-3" />
                                      En retard
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500">{project.client}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Détails projet */}
              <div>
                {selectedProject ? (
                  <Card className="border border-gray-200 shadow-sm">
                    <CardHeader className="pb-2 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-brand-dark">{selectedProject.name}</CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-brand-dark">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="border-gray-200">
                            <DropdownMenuLabel className="text-brand-dark">Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-gray-100" />
                            <DropdownMenuItem className="text-gray-700 focus:text-brand-dark focus:bg-gray-50">
                              <Edit className="mr-2 h-4 w-4 text-brand-blue" />
                              Modifier le projet
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-gray-700 focus:text-brand-dark focus:bg-gray-50">
                              <Send className="mr-2 h-4 w-4 text-brand-blue" />
                              Envoyer un email au client
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardDescription>
                        Client : {selectedProject.client} • Démarré le :{" "}
                        {new Date(selectedProject.startDate).toLocaleDateString("fr-FR")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <Tabs defaultValue="details" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                          <TabsTrigger
                            value="details"
                            className="data-[state=active]:bg-white data-[state=active]:text-brand-dark data-[state=active]:shadow-sm"
                          >
                            Détails
                          </TabsTrigger>
                          <TabsTrigger
                            value="stages"
                            className="data-[state=active]:bg-white data-[state=active]:text-brand-dark data-[state=active]:shadow-sm"
                          >
                            Étapes
                          </TabsTrigger>
                          <TabsTrigger
                            value="comments"
                            className="data-[state=active]:bg-white data-[state=active]:text-brand-dark data-[state=active]:shadow-sm"
                          >
                            Commentaires
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="details" className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-brand-dark">Informations client</h4>
                            <div className="rounded-md bg-gray-50 p-3">
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-brand-blue" />
                                <span className="text-sm text-gray-700">{selectedProject.client}</span>
                              </div>
                              <div className="mt-1 flex items-center space-x-2">
                                <MessageSquare className="h-4 w-4 text-brand-blue" />
                                <span className="text-sm text-gray-700">{selectedProject.clientEmail}</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-brand-dark">Étape actuelle</h4>
                            <div className="rounded-md bg-gray-50 p-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">
                                  {selectedProject.stages.find((s) => s.id === selectedProject.currentStage)?.name}
                                </span>
                                <Badge
                                  className={
                                    selectedProject.stages.find((s) => s.id === selectedProject.currentStage)
                                      ?.status === "terminé"
                                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                                      : selectedProject.stages.find((s) => s.id === selectedProject.currentStage)
                                            ?.status === "en cours"
                                        ? "bg-brand-yellow/20 text-brand-dark hover:bg-brand-yellow/30"
                                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                  }
                                >
                                  {selectedProject.stages.find((s) => s.id === selectedProject.currentStage)?.status}
                                </Badge>
                              </div>
                              {selectedProject.stages.find((s) => s.id === selectedProject.currentStage)?.date && (
                                <p className="mt-1 text-xs text-gray-500">
                                  Depuis le{" "}
                                  {new Date(
                                    selectedProject.stages.find((s) => s.id === selectedProject.currentStage)?.date,
                                  ).toLocaleDateString("fr-FR")}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-brand-dark">Actions</h4>
                            <div className="flex flex-col space-y-2">
                              <Button
                                onClick={handleCompleteStage}
                                className="bg-brand-yellow text-brand-dark hover:bg-brand-yellow/90"
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Marquer l'étape comme terminée
                              </Button>
                              <Button
                                variant="outline"
                                className="border-brand-blue text-brand-blue hover:bg-brand-blue/10 relative overflow-hidden"
                                asChild
                              >
                                <label className="cursor-pointer w-full">
                                  <FileText className="mr-2 h-4 w-4" />
                                  Ajouter des documents
                                  <input
                                    type="file"
                                    onChange={handleFileUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    style={{ width: "100%", height: "100%" }}
                                  />
                                </label>
                              </Button>
                              {uploadedFile && (
                                <div className="mt-2 text-xs text-gray-600">
                                  Fichier sélectionné : {uploadedFile.name}
                                </div>
                              )}
                              <Button
                                variant="outline"
                                className="border-brand-blue text-brand-blue hover:bg-brand-blue/10"
                                onClick={handleSendEmail}
                              >
                                <Send className="mr-2 h-4 w-4" />
                                Envoyer un email au client
                              </Button>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="stages" className="space-y-4 pt-4">
                          <div className="space-y-4">
                            {selectedProject.stages.map((stage) => (
                              <div key={stage.id} className="flex items-center space-x-4">
                                <div
                                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                    stage.status === "terminé"
                                      ? "bg-green-100 text-green-600"
                                      : stage.status === "en cours"
                                        ? "bg-brand-yellow/20 text-brand-dark"
                                        : "bg-gray-100 text-gray-400"
                                  }`}
                                >
                                  {stage.id}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-brand-dark">{stage.name}</h4>
                                    <Badge
                                      variant={
                                        stage.status === "terminé"
                                          ? "default"
                                          : stage.status === "en cours"
                                            ? "secondary"
                                            : "outline"
                                      }
                                      className={
                                        stage.status === "terminé"
                                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                                          : stage.status === "en cours"
                                            ? "bg-brand-yellow/20 text-brand-dark hover:bg-brand-yellow/30"
                                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                      }
                                    >
                                      {stage.status}
                                    </Badge>
                                  </div>
                                  {stage.date && (
                                    <p className="text-xs text-gray-500">
                                      {stage.status === "terminé" ? "Terminé le " : "Démarré le "}
                                      {new Date(stage.date).toLocaleDateString("fr-FR")}
                                    </p>
                                  )}
                                  {stage.feedbackRounds !== undefined && (
                                    <p className="text-xs text-gray-500">
                                      Tours de feedback : {stage.feedbackRounds}/{stage.maxFeedbackRounds}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </TabsContent>

                        <TabsContent value="comments" className="space-y-4 pt-4">
                          <div className="space-y-4">
                            {selectedProject.comments.map((comment) => (
                              <div key={comment.id} className="rounded-md bg-gray-50 p-3">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-medium text-brand-dark">{comment.user}</h4>
                                  <span className="text-xs text-gray-500">
                                    {new Date(comment.date).toLocaleDateString("fr-FR")}
                                  </span>
                                </div>
                                <p className="mt-1 text-sm text-gray-700">{comment.text}</p>
                              </div>
                            ))}

                            <div className="flex items-center space-x-2">
                              <Textarea
                                placeholder="Ajouter un commentaire..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="min-h-[80px] border-gray-200 focus:border-brand-blue focus:ring-brand-blue/20"
                              />
                            </div>
                            <Button
                              onClick={handleAddComment}
                              className="w-full bg-brand-yellow text-brand-dark hover:bg-brand-yellow/90"
                            >
                              Ajouter le commentaire
                            </Button>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-100">
                      <CardTitle className="text-brand-dark">Détails du projet</CardTitle>
                      <CardDescription>Sélectionnez un projet pour voir les détails</CardDescription>
                    </CardHeader>
                    <CardContent className="flex h-[400px] items-center justify-center">
                      <p className="text-center text-gray-500">Aucun projet sélectionné</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 bg-gray-50">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
            © 2024 ProjectFlow. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}
