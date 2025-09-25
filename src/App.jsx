import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Calendar, Clock, Cloud, Users, Wrench, FileText, Camera, Download, Plus, Trash2, Edit2 } from 'lucide-react'
import jsPDF from 'jspdf'
import logoIpex from './assets/logo.png'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    // Dados da obra
    obraSelecionada: '',
    responsavelRDO: '',
    numeroRDO: '',
    dataRelatorio: new Date().toISOString().split('T')[0],
    
    // Horário de trabalho
    horaInicio: '',
    horaFim: '',
    horaInicioIntervalo: '',
    horaFimIntervalo: '',
    
    // Condições climáticas
    climaManha: '',
    climaTarde: '',
    climaNoite: '',
    praticavelManha: true,
    praticavelTarde: true,
    praticavelNoite: true,
    
    // Empreiteiras
    empreiteiras: [],
    
    // Mão de obra
    maoDeObra: [],
    
    // Equipamentos
    equipamentos: [],
    
    // Atividades
    atividades: [],
    
    // Ocorrências
    ocorrencias: [],
    
    // Materiais
    materiais: [],
    
    // Comentários
    comentarios: ''
  })

  // Estados para formulários temporários
  const [currentEmpreiteira, setCurrentEmpreiteira] = useState({ nome: '', numColaboradores: '', responsavel: '' })
  const [currentMaoObra, setCurrentMaoObra] = useState({ funcao: '', funcaoOutro: '', nomeCompleto: '', observacoes: '' })
  const [currentEquipamento, setCurrentEquipamento] = useState({ nome: '', nomeOutro: '', quantidade: '', status: '', observacoes: '' })
  const [currentAtividade, setCurrentAtividade] = useState({ descricao: '', local: '', status: '', observacoes: '', executores: [], foto: null })
  const [currentOcorrencia, setCurrentOcorrencia] = useState({ tipo: '', descricao: '', prioridade: '', foto: null })
  const [currentMaterial, setCurrentMaterial] = useState({ nome: '', quantidade: '', unidade: '', fornecedor: '', tipo: 'recebido' })

  // Estados para edição
  const [editingItem, setEditingItem] = useState(null)
  const [editingType, setEditingType] = useState(null)

  // Obras pré-definidas
  const obrasPredefinidas = [
    { id: 'ny-lofts', nome: 'New York Lofts', endereco: 'Rua São Genaro 100, São Francisco, Camboriú - SC' },
    { id: 'carpe-diem', nome: 'Carpe Diem Residencial', endereco: 'Rua Santa Terezinha, 250 - São Francisco de Assis, Camboriú - SC' },
    { id: 'manhattan-lofts', nome: 'Manhattan Lofts', endereco: 'Rua Miguel 235, Bairro São Francisco, Camboriú - SC' },
    { id: 'passeio-ipex', nome: 'Passeio Ipex', endereco: 'Av. Santo Amaro, 1330 - Bairro São Francisco, Camboriú - SC' },
    { id: 'green-tower', nome: 'Green Tower', endereco: 'São Miguel 320 Rua Bairro São Francisco, Camboriú - SC' },
    { id: 'privilege-smart', nome: 'Privilege Smart', endereco: 'Rua São Genaro 10, São Francisco, Camboriú – SC' },
    { id: 'escritorio-ipex', nome: 'Escritório Ipex', endereco: 'Rua Santo Amaro,1330 , São Francisco, Camboriú – SC' }
  ]

  // Funções de atualização
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Geração automática do número RDO baseado na data
  useEffect(() => {
    if (formData.dataRelatorio) {
      const date = new Date(formData.dataRelatorio)
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      const numeroRDO = `${day}${month}${year}`
      updateFormData('numeroRDO', numeroRDO)
    }
  }, [formData.dataRelatorio])

  // Funções para adicionar itens
  const addEmpreiteira = () => {
    if (currentEmpreiteira.nome && currentEmpreiteira.numColaboradores) {
      updateFormData('empreiteiras', [...formData.empreiteiras, { ...currentEmpreiteira, id: Date.now() }])
      setCurrentEmpreiteira({ nome: '', numColaboradores: '', responsavel: '' })
    }
  }

  const addMaoObra = () => {
    if (currentMaoObra.funcao && currentMaoObra.nomeCompleto) {
      const funcaoFinal = currentMaoObra.funcao === 'outro' ? currentMaoObra.funcaoOutro : currentMaoObra.funcao
      updateFormData('maoDeObra', [...formData.maoDeObra, { 
        ...currentMaoObra, 
        funcaoDisplay: funcaoFinal,
        id: Date.now() 
      }])
      setCurrentMaoObra({ funcao: '', funcaoOutro: '', nomeCompleto: '', observacoes: '' })
    }
  }

  const addEquipamento = () => {
    if (currentEquipamento.nome && currentEquipamento.quantidade) {
      const nomeEquipamentoFinal = currentEquipamento.nome === 'outro' ? currentEquipamento.nomeOutro : currentEquipamento.nome
      updateFormData('equipamentos', [...formData.equipamentos, { 
        ...currentEquipamento, 
        nomeDisplay: nomeEquipamentoFinal,
        id: Date.now() 
      }])
      setCurrentEquipamento({ nome: '', nomeOutro: '', quantidade: '', status: '', observacoes: '' })
    }
  }

  const addAtividade = () => {
    if (currentAtividade.descricao) {
      updateFormData('atividades', [...formData.atividades, { ...currentAtividade, id: Date.now() }])
      setCurrentAtividade({ descricao: '', local: '', status: '', observacoes: '', executores: [], foto: null })
    }
  }

  const addOcorrencia = () => {
    if (currentOcorrencia.descricao) {
      updateFormData('ocorrencias', [...formData.ocorrencias, { ...currentOcorrencia, id: Date.now() }])
      setCurrentOcorrencia({ tipo: '', descricao: '', prioridade: '', foto: null })
    }
  }

  const addMaterial = () => {
    if (currentMaterial.nome && currentMaterial.quantidade) {
      updateFormData('materiais', [...formData.materiais, { ...currentMaterial, id: Date.now() }])
      setCurrentMaterial({ nome: '', quantidade: '', unidade: '', fornecedor: '', tipo: 'recebido' })
    }
  }

  // Funções para remover e editar itens
  const removeItem = (array, id, field) => {
    updateFormData(field, array.filter(item => item.id !== id))
  }

  const startEdit = (item, type) => {
    setEditingItem(item)
    setEditingType(type)
    
    switch(type) {
      case 'empreiteira':
        setCurrentEmpreiteira(item)
        break
      case 'maoObra':
        setCurrentMaoObra(item)
        break
      case 'equipamento':
        setCurrentEquipamento(item)
        break
      case 'atividade':
        setCurrentAtividade(item)
        break
      case 'ocorrencia':
        setCurrentOcorrencia(item)
        break
      case 'material':
        setCurrentMaterial(item)
        break
    }
  }

  const saveEdit = () => {
    if (!editingItem || !editingType) return

    const fieldMap = {
      empreiteira: 'empreiteiras',
      maoObra: 'maoDeObra',
      equipamento: 'equipamentos',
      atividade: 'atividades',
      ocorrencia: 'ocorrencias',
      material: 'materiais'
    }

    const field = fieldMap[editingType]
    let updatedItem = { ...editingItem }

    switch(editingType) {
      case 'empreiteira':
        updatedItem = { ...currentEmpreiteira, id: editingItem.id }
        break
      case 'maoObra':
        const funcaoFinal = currentMaoObra.funcao === 'outro' ? currentMaoObra.funcaoOutro : currentMaoObra.funcao
        updatedItem = { ...currentMaoObra, funcaoDisplay: funcaoFinal, id: editingItem.id }
        break
      case 'equipamento':
        const nomeEquipamentoFinal = currentEquipamento.nome === 'outro' ? currentEquipamento.nomeOutro : currentEquipamento.nome
        updatedItem = { ...currentEquipamento, nomeDisplay: nomeEquipamentoFinal, id: editingItem.id }
        break
      case 'atividade':
        updatedItem = { ...currentAtividade, id: editingItem.id }
        break
      case 'ocorrencia':
        updatedItem = { ...currentOcorrencia, id: editingItem.id }
        break
      case 'material':
        updatedItem = { ...currentMaterial, id: editingItem.id }
        break
    }

    const updatedArray = formData[field].map(item => 
      item.id === editingItem.id ? updatedItem : item
    )

    updateFormData(field, updatedArray)
    cancelEdit()
  }

  const cancelEdit = () => {
    setEditingItem(null)
    setEditingType(null)
    setCurrentEmpreiteira({ nome: '', numColaboradores: '', responsavel: '' })
    setCurrentMaoObra({ funcao: '', funcaoOutro: '', nomeCompleto: '', observacoes: '' })
    setCurrentEquipamento({ nome: '', nomeOutro: '', quantidade: '', status: '', observacoes: '' })
    setCurrentAtividade({ descricao: '', local: '', status: '', observacoes: '', executores: [], foto: null })
    setCurrentOcorrencia({ tipo: '', descricao: '', prioridade: '', foto: null })
    setCurrentMaterial({ nome: '', quantidade: '', unidade: '', fornecedor: '', tipo: 'recebido' })
  }

  // Função para calcular horas trabalhadas
  const calcularHorasTrabalhadas = () => {
    if (!formData.horaInicio || !formData.horaFim) return '0:00'
    
    const inicio = new Date(`2000-01-01T${formData.horaInicio}:00`)
    const fim = new Date(`2000-01-01T${formData.horaFim}:00`)
    const inicioIntervalo = formData.horaInicioIntervalo ? new Date(`2000-01-01T${formData.horaInicioIntervalo}:00`) : null
    const fimIntervalo = formData.horaFimIntervalo ? new Date(`2000-01-01T${formData.horaFimIntervalo}:00`) : null
    
    let totalMinutos = (fim - inicio) / (1000 * 60)
    
    if (inicioIntervalo && fimIntervalo) {
      const intervaloMinutos = (fimIntervalo - inicioIntervalo) / (1000 * 60)
      totalMinutos -= intervaloMinutos
    }
    
    const horas = Math.floor(totalMinutos / 60)
    const minutos = totalMinutos % 60
    
    return `${horas}:${minutos.toString().padStart(2, '0')}`
  }

  // Função para obter dados da obra selecionada
  const getObraSelecionada = () => {
    return obrasPredefinidas.find(obra => obra.id === formData.obraSelecionada)
  }

  // Função para converter arquivo para base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  // Função para gerar PDF
  const gerarPDF = async () => {
    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    let yPosition = 20

    // Função auxiliar para adicionar nova página se necessário
    const checkNewPage = (requiredHeight) => {
      if (yPosition + requiredHeight > pageHeight - 20) {
        pdf.addPage()
        yPosition = 20
      }
    }

    // Cabeçalho com logo
    try {
      const logoResponse = await fetch(logoIpex)
      const logoBlob = await logoResponse.blob()
      const logoBase64 = await fileToBase64(logoBlob)
      pdf.addImage(logoBase64, 'PNG', 20, yPosition, 40, 15)
    } catch (error) {
      console.log('Erro ao carregar logo:', error)
    }

    // Título
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    pdf.text('DIÁRIO DE OBRA DIGITAL', pageWidth / 2, yPosition + 10, { align: 'center' })
    
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'normal')
    pdf.text('IPEX Construtora', pageWidth / 2, yPosition + 20, { align: 'center' })
    
    yPosition += 35

    // Dados da obra
    const obraSelecionada = getObraSelecionada()
    if (obraSelecionada) {
      checkNewPage(30)
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('DADOS DA OBRA', 20, yPosition)
      yPosition += 10
      
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Obra: ${obraSelecionada.nome}`, 20, yPosition)
      yPosition += 5
      pdf.text(`Endereço: ${obraSelecionada.endereco}`, 20, yPosition)
      yPosition += 5
      pdf.text(`RDO Nº: ${formData.numeroRDO}`, 20, yPosition)
      yPosition += 5
      pdf.text(`Data: ${new Date(formData.dataRelatorio).toLocaleDateString('pt-BR')}`, 20, yPosition)
      yPosition += 5
      pdf.text(`Responsável: ${formData.responsavelRDO}`, 20, yPosition)
      yPosition += 15
    }

    // Horário de trabalho
    if (formData.horaInicio || formData.horaFim) {
      checkNewPage(25)
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('HORÁRIO DE TRABALHO', 20, yPosition)
      yPosition += 10
      
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Início: ${formData.horaInicio || 'N/A'} | Fim: ${formData.horaFim || 'N/A'}`, 20, yPosition)
      yPosition += 5
      if (formData.horaInicioIntervalo || formData.horaFimIntervalo) {
        pdf.text(`Intervalo: ${formData.horaInicioIntervalo || 'N/A'} às ${formData.horaFimIntervalo || 'N/A'}`, 20, yPosition)
        yPosition += 5
      }
      pdf.text(`Total trabalhado: ${calcularHorasTrabalhadas()}`, 20, yPosition)
      yPosition += 15
    }

    // Condições climáticas
    if (formData.climaManha || formData.climaTarde || formData.climaNoite) {
      checkNewPage(25)
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('CONDIÇÕES CLIMÁTICAS', 20, yPosition)
      yPosition += 10
      
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      if (formData.climaManha) {
        pdf.text(`Manhã: ${formData.climaManha} ${formData.praticavelManha ? '(Praticável)' : '(Não praticável)'}`, 20, yPosition)
        yPosition += 5
      }
      if (formData.climaTarde) {
        pdf.text(`Tarde: ${formData.climaTarde} ${formData.praticavelTarde ? '(Praticável)' : '(Não praticável)'}`, 20, yPosition)
        yPosition += 5
      }
      if (formData.climaNoite) {
        pdf.text(`Noite: ${formData.climaNoite} ${formData.praticavelNoite ? '(Praticável)' : '(Não praticável)'}`, 20, yPosition)
        yPosition += 5
      }
      yPosition += 10
    }

    // Empreiteiras
    if (formData.empreiteiras.length > 0) {
      checkNewPage(20 + formData.empreiteiras.length * 8)
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('EMPREITEIRAS', 20, yPosition)
      yPosition += 10
      
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      formData.empreiteiras.forEach((empreiteira) => {
        pdf.text(`• ${empreiteira.nome} - ${empreiteira.numColaboradores} colaboradores`, 25, yPosition)
        yPosition += 5
        if (empreiteira.responsavel) {
          pdf.text(`  Responsável: ${empreiteira.responsavel}`, 25, yPosition)
          yPosition += 5
        }
      })
      yPosition += 10
    }

    // Mão de obra
    if (formData.maoDeObra.length > 0) {
      checkNewPage(20 + formData.maoDeObra.length * 8)
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('MÃO DE OBRA', 20, yPosition)
      yPosition += 10
      
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      formData.maoDeObra.forEach((mao) => {
        pdf.text(`• ${mao.nomeCompleto} - ${mao.funcaoDisplay}`, 25, yPosition)
        yPosition += 5
        if (mao.observacoes) {
          pdf.text(`  Obs: ${mao.observacoes}`, 25, yPosition)
          yPosition += 5
        }
      })
      yPosition += 10
    }

    // Equipamentos
    if (formData.equipamentos.length > 0) {
      checkNewPage(20 + formData.equipamentos.length * 8)
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('EQUIPAMENTOS', 20, yPosition)
      yPosition += 10
      
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      formData.equipamentos.forEach((equipamento) => {
        pdf.text(`• ${equipamento.nomeDisplay} - Qtd: ${equipamento.quantidade} - Status: ${equipamento.status}`, 25, yPosition)
        yPosition += 5
        if (equipamento.observacoes) {
          pdf.text(`  Obs: ${equipamento.observacoes}`, 25, yPosition)
          yPosition += 5
        }
      })
      yPosition += 10
    }

    // Atividades executadas
    if (formData.atividades.length > 0) {
      for (const atividade of formData.atividades) {
        checkNewPage(40)
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.text('ATIVIDADE EXECUTADA', 20, yPosition)
        yPosition += 10
        
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        pdf.text(`Descrição: ${atividade.descricao}`, 20, yPosition)
        yPosition += 5
        if (atividade.local) {
          pdf.text(`Local: ${atividade.local}`, 20, yPosition)
          yPosition += 5
        }
        pdf.text(`Status: ${atividade.status}`, 20, yPosition)
        yPosition += 5
        
        if (atividade.executores && atividade.executores.length > 0) {
          pdf.text('Executores:', 20, yPosition)
          yPosition += 5
          atividade.executores.forEach((executor) => {
            const nomeExecutor = executor.tipo === 'empreiteira' ? executor.nome : `${executor.nomeCompleto} (${executor.funcaoDisplay})`
            pdf.text(`• ${nomeExecutor}`, 25, yPosition)
            yPosition += 5
          })
        }
        
        if (atividade.observacoes) {
          pdf.text(`Observações: ${atividade.observacoes}`, 20, yPosition)
          yPosition += 5
        }
        
        // Adicionar foto se existir
        if (atividade.foto) {
          try {
            checkNewPage(60)
            const fotoBase64 = await fileToBase64(atividade.foto)
            pdf.addImage(fotoBase64, 'JPEG', 20, yPosition, 80, 60)
            yPosition += 65
          } catch (error) {
            console.log('Erro ao adicionar foto da atividade:', error)
          }
        }
        
        yPosition += 10
      }
    }

    // Ocorrências
    if (formData.ocorrencias.length > 0) {
      for (const ocorrencia of formData.ocorrencias) {
        checkNewPage(40)
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.text('OCORRÊNCIA', 20, yPosition)
        yPosition += 10
        
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        pdf.text(`Tipo: ${ocorrencia.tipo} | Prioridade: ${ocorrencia.prioridade}`, 20, yPosition)
        yPosition += 5
        pdf.text(`Descrição: ${ocorrencia.descricao}`, 20, yPosition)
        yPosition += 5
        
        // Adicionar foto se existir
        if (ocorrencia.foto) {
          try {
            checkNewPage(60)
            const fotoBase64 = await fileToBase64(ocorrencia.foto)
            pdf.addImage(fotoBase64, 'JPEG', 20, yPosition, 80, 60)
            yPosition += 65
          } catch (error) {
            console.log('Erro ao adicionar foto da ocorrência:', error)
          }
        }
        
        yPosition += 10
      }
    }

    // Materiais
    if (formData.materiais.length > 0) {
      checkNewPage(20 + formData.materiais.length * 8)
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('MATERIAIS', 20, yPosition)
      yPosition += 10
      
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      formData.materiais.forEach((material) => {
        pdf.text(`• ${material.nome} - ${material.quantidade} ${material.unidade} (${material.tipo})`, 25, yPosition)
        yPosition += 5
        if (material.fornecedor) {
          pdf.text(`  Fornecedor: ${material.fornecedor}`, 25, yPosition)
          yPosition += 5
        }
      })
      yPosition += 10
    }

    // Comentários gerais
    if (formData.comentarios) {
      checkNewPage(30)
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('COMENTÁRIOS GERAIS', 20, yPosition)
      yPosition += 10
      
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      const comentarios = pdf.splitTextToSize(formData.comentarios, pageWidth - 40)
      pdf.text(comentarios, 20, yPosition)
    }

    // Salvar PDF
    const nomeArquivo = `Diario_Obra_RDO_${formData.numeroRDO}_${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(nomeArquivo)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="ipex-card ipex-header smooth-transition">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img src={logoIpex} alt="IPEX Construtora" className="h-20 w-auto drop-shadow-lg" />
            </div>
            <CardTitle className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-2">
              <FileText className="h-10 w-10" />
              Diário de Obra Digital
            </CardTitle>
            <CardDescription className="text-gray-700 text-lg">
              Sistema completo para registro e controle de atividades diárias da obra - IPEX Construtora
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Dados da Obra */}
        <Card className="ipex-card smooth-transition">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 ipex-section-title">
              <FileText className="h-5 w-5" />
              Dados da Obra
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="obraSelecionada">Selecionar Obra</Label>
              <Select
                value={formData.obraSelecionada}
                onValueChange={(value) => updateFormData('obraSelecionada', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma obra" />
                </SelectTrigger>
                <SelectContent>
                  {obrasPredefinidas.map((obra) => (
                    <SelectItem key={obra.id} value={obra.id}>
                      {obra.nome} - {obra.endereco}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {getObraSelecionada() && (
              <div className="md:col-span-2 bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800">{getObraSelecionada().nome}</h3>
                <p className="text-green-700">{getObraSelecionada().endereco}</p>
              </div>
            )}

            <div>
              <Label htmlFor="responsavelRDO">Responsável pelo Preenchimento do RDO</Label>
              <Input
                id="responsavelRDO"
                value={formData.responsavelRDO}
                onChange={(e) => updateFormData('responsavelRDO', e.target.value)}
                placeholder="Nome do responsável"
              />
            </div>
            <div>
              <Label htmlFor="dataRelatorio">Data do Relatório</Label>
              <Input
                id="dataRelatorio"
                type="date"
                value={formData.dataRelatorio}
                onChange={(e) => updateFormData('dataRelatorio', e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="numeroRDO">Número do RDO (Gerado Automaticamente)</Label>
              <Input
                id="numeroRDO"
                value={formData.numeroRDO}
                readOnly
                className="bg-gray-100"
                placeholder="Será gerado automaticamente baseado na data"
              />
            </div>
          </CardContent>
        </Card>

        {/* Horário de Trabalho */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Horário de Trabalho
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <Label htmlFor="horaInicio">Hora Início</Label>
                <Input
                  id="horaInicio"
                  type="time"
                  value={formData.horaInicio}
                  onChange={(e) => updateFormData('horaInicio', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="horaFim">Hora Fim</Label>
                <Input
                  id="horaFim"
                  type="time"
                  value={formData.horaFim}
                  onChange={(e) => updateFormData('horaFim', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="horaInicioIntervalo">Início Intervalo</Label>
                <Input
                  id="horaInicioIntervalo"
                  type="time"
                  value={formData.horaInicioIntervalo}
                  onChange={(e) => updateFormData('horaInicioIntervalo', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="horaFimIntervalo">Fim Intervalo</Label>
                <Input
                  id="horaFimIntervalo"
                  type="time"
                  value={formData.horaFimIntervalo}
                  onChange={(e) => updateFormData('horaFimIntervalo', e.target.value)}
                />
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm font-medium">
                Total de horas trabalhadas: <span className="text-green-600">{calcularHorasTrabalhadas()}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Condições Climáticas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Condições Climáticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Manhã', 'Tarde', 'Noite'].map((periodo) => {
                const field = `clima${periodo}`
                const praticavelField = `praticavel${periodo}`
                return (
                  <div key={periodo} className="space-y-2">
                    <Label>{periodo}</Label>
                    <Select
                      value={formData[field]}
                      onValueChange={(value) => updateFormData(field, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o clima" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ensolarado">☀️ Ensolarado</SelectItem>
                        <SelectItem value="nublado">☁️ Nublado</SelectItem>
                        <SelectItem value="chuvoso">🌧️ Chuvoso</SelectItem>
                        <SelectItem value="ventoso">💨 Ventoso</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={praticavelField}
                        checked={formData[praticavelField]}
                        onChange={(e) => updateFormData(praticavelField, e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor={praticavelField} className="text-sm">
                        Período praticável
                      </Label>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Empreiteiras */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Empreiteiras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="nomeEmpreiteira">Nome da Empreiteira</Label>
                <Input
                  id="nomeEmpreiteira"
                  value={currentEmpreiteira.nome}
                  onChange={(e) => setCurrentEmpreiteira(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Nome da empresa"
                />
              </div>
              <div>
                <Label htmlFor="numColaboradores">Nº de Colaboradores</Label>
                <Input
                  id="numColaboradores"
                  type="number"
                  value={currentEmpreiteira.numColaboradores}
                  onChange={(e) => setCurrentEmpreiteira(prev => ({ ...prev, numColaboradores: e.target.value }))}
                  placeholder="Quantidade"
                />
              </div>
              <div>
                <Label htmlFor="responsavelEmpreiteira">Responsável</Label>
                <Input
                  id="responsavelEmpreiteira"
                  value={currentEmpreiteira.responsavel}
                  onChange={(e) => setCurrentEmpreiteira(prev => ({ ...prev, responsavel: e.target.value }))}
                  placeholder="Nome do responsável"
                />
              </div>
            </div>
            
            <div className="flex gap-2 mb-4">
              {editingType === 'empreiteira' ? (
                <>
                  <Button onClick={saveEdit} className="ipex-green btn-hover-lift smooth-transition">
                    Salvar Edição
                  </Button>
                  <Button onClick={cancelEdit} variant="outline">
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button onClick={addEmpreiteira} className="ipex-green btn-hover-lift smooth-transition">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Empreiteira
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              {formData.empreiteiras.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div>
                    <span className="font-medium">{item.nome}</span>
                    <Badge variant="secondary" className="ml-2">{item.numColaboradores} colaboradores</Badge>
                    {item.responsavel && <p className="text-sm text-gray-600 mt-1">Responsável: {item.responsavel}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(item, 'empreiteira')}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItem(formData.empreiteiras, item.id, 'empreiteiras')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mão de Obra */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Mão de Obra
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="funcaoMaoObra">Função</Label>
                <Select
                  value={currentMaoObra.funcao}
                  onValueChange={(value) => setCurrentMaoObra(prev => ({ ...prev, funcao: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pedreiro">Pedreiro</SelectItem>
                    <SelectItem value="servente">Servente</SelectItem>
                    <SelectItem value="eletricista">Eletricista</SelectItem>
                    <SelectItem value="encanador">Encanador</SelectItem>
                    <SelectItem value="carpinteiro">Carpinteiro</SelectItem>
                    <SelectItem value="pintor">Pintor</SelectItem>
                    <SelectItem value="soldador">Soldador</SelectItem>
                    <SelectItem value="operador-maquina">Operador de Máquina</SelectItem>
                    <SelectItem value="mestre-obras">Mestre de Obras</SelectItem>
                    <SelectItem value="engenheiro">Engenheiro</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
                {currentMaoObra.funcao === 'outro' && (
                  <Input
                    className="mt-2"
                    value={currentMaoObra.funcaoOutro || ''}
                    onChange={(e) => setCurrentMaoObra(prev => ({ ...prev, funcaoOutro: e.target.value }))}
                    placeholder="Especifique a função"
                  />
                )}
              </div>
              <div>
                <Label htmlFor="nomeCompletoMao">Nome Completo</Label>
                <Input
                  id="nomeCompletoMao"
                  value={currentMaoObra.nomeCompleto}
                  onChange={(e) => setCurrentMaoObra(prev => ({ ...prev, nomeCompleto: e.target.value }))}
                  placeholder="Nome completo do trabalhador"
                />
              </div>
              <div>
                <Label htmlFor="observacoesMao">Observações</Label>
                <Input
                  id="observacoesMao"
                  value={currentMaoObra.observacoes}
                  onChange={(e) => setCurrentMaoObra(prev => ({ ...prev, observacoes: e.target.value }))}
                  placeholder="Observações adicionais"
                />
              </div>
            </div>
            
            <div className="flex gap-2 mb-4">
              {editingType === 'maoObra' ? (
                <>
                  <Button onClick={saveEdit} className="bg-green-600 hover:bg-green-700">
                    Salvar Edição
                  </Button>
                  <Button onClick={cancelEdit} variant="outline">
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button onClick={addMaoObra} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Mão de Obra
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              {formData.maoDeObra.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div>
                    <span className="font-medium">{item.funcaoDisplay}</span>
                    <Badge variant="secondary" className="ml-2">{item.nomeCompleto}</Badge>
                    {item.observacoes && <p className="text-sm text-gray-600 mt-1">{item.observacoes}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(item, 'maoObra')}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItem(formData.maoDeObra, item.id, 'maoDeObra')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Equipamentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Equipamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <Label htmlFor="nomeEquipamento">Nome do Equipamento</Label>
                <Select
                  value={currentEquipamento.nome}
                  onValueChange={(value) => setCurrentEquipamento(prev => ({ ...prev, nome: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o equipamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="betoneira">Betoneira</SelectItem>
                    <SelectItem value="furadeira">Furadeira</SelectItem>
                    <SelectItem value="serra-circular">Serra Circular</SelectItem>
                    <SelectItem value="martelo-pneumatico">Martelo Pneumático</SelectItem>
                    <SelectItem value="compressor">Compressor</SelectItem>
                    <SelectItem value="andaime">Andaime</SelectItem>
                    <SelectItem value="guincho">Guincho</SelectItem>
                    <SelectItem value="escavadeira">Escavadeira</SelectItem>
                    <SelectItem value="caminhao-basculante">Caminhão Basculante</SelectItem>
                    <SelectItem value="grua">Grua</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
                {currentEquipamento.nome === 'outro' && (
                  <Input
                    className="mt-2"
                    value={currentEquipamento.nomeOutro || ''}
                    onChange={(e) => setCurrentEquipamento(prev => ({ ...prev, nomeOutro: e.target.value }))}
                    placeholder="Especifique o equipamento"
                  />
                )}
              </div>
              <div>
                <Label htmlFor="quantidadeEquipamento">Quantidade</Label>
                <Input
                  id="quantidadeEquipamento"
                  type="number"
                  value={currentEquipamento.quantidade}
                  onChange={(e) => setCurrentEquipamento(prev => ({ ...prev, quantidade: e.target.value }))}
                  placeholder="Quantidade"
                />
              </div>
              <div>
                <Label htmlFor="statusEquipamento">Status</Label>
                <Select
                  value={currentEquipamento.status}
                  onValueChange={(value) => setCurrentEquipamento(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="funcionando">Funcionando</SelectItem>
                    <SelectItem value="manutencao">Em Manutenção</SelectItem>
                    <SelectItem value="parado">Parado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="observacoesEquipamento">Observações</Label>
                <Input
                  id="observacoesEquipamento"
                  value={currentEquipamento.observacoes}
                  onChange={(e) => setCurrentEquipamento(prev => ({ ...prev, observacoes: e.target.value }))}
                  placeholder="Observações"
                />
              </div>
            </div>
            
            <div className="flex gap-2 mb-4">
              {editingType === 'equipamento' ? (
                <>
                  <Button onClick={saveEdit} className="bg-green-600 hover:bg-green-700">
                    Salvar Edição
                  </Button>
                  <Button onClick={cancelEdit} variant="outline">
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button onClick={addEquipamento} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Equipamento
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              {formData.equipamentos.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div>
                    <span className="font-medium">{item.nomeDisplay}</span>
                    <Badge variant="secondary" className="ml-2">{item.quantidade} unidades</Badge>
                    <Badge 
                      variant={item.status === 'funcionando' ? 'default' : item.status === 'manutencao' ? 'destructive' : 'secondary'} 
                      className="ml-2"
                    >
                      {item.status}
                    </Badge>
                    {item.observacoes && <p className="text-sm text-gray-600 mt-1">{item.observacoes}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(item, 'equipamento')}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItem(formData.equipamentos, item.id, 'equipamentos')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Atividades Executadas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Atividades Executadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="descricaoAtividade">Descrição da Atividade</Label>
                <Textarea
                  id="descricaoAtividade"
                  value={currentAtividade.descricao}
                  onChange={(e) => setCurrentAtividade(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Descreva a atividade executada"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="localAtividade">Local</Label>
                <Input
                  id="localAtividade"
                  value={currentAtividade.local}
                  onChange={(e) => setCurrentAtividade(prev => ({ ...prev, local: e.target.value }))}
                  placeholder="Local onde foi executada"
                />
                <Label htmlFor="statusAtividade" className="mt-2 block">Status</Label>
                <Select
                  value={currentAtividade.status}
                  onValueChange={(value) => setCurrentAtividade(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status da atividade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="concluida">Concluída</SelectItem>
                    <SelectItem value="em-andamento">Em Andamento</SelectItem>
                    <SelectItem value="paralisada">Paralisada</SelectItem>
                    <SelectItem value="nao-iniciada">Não Iniciada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Múltiplos Executores */}
            <div className="mb-4">
              <Label>Executores da Atividade</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <Label>Selecionar Empreiteiras</Label>
                  <Select
                    onValueChange={(value) => {
                      const empreiteira = formData.empreiteiras.find(e => e.id.toString() === value)
                      if (empreiteira && !currentAtividade.executores.find(ex => ex.id === empreiteira.id && ex.tipo === 'empreiteira')) {
                        setCurrentAtividade(prev => ({
                          ...prev,
                          executores: [...prev.executores, { ...empreiteira, tipo: 'empreiteira' }]
                        }))
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Adicionar empreiteira" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.empreiteiras.map((empreiteira) => (
                        <SelectItem key={empreiteira.id} value={empreiteira.id.toString()}>
                          {empreiteira.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Selecionar Mão de Obra</Label>
                  <Select
                    onValueChange={(value) => {
                      const maoObra = formData.maoDeObra.find(m => m.id.toString() === value)
                      if (maoObra && !currentAtividade.executores.find(ex => ex.id === maoObra.id && ex.tipo === 'maoObra')) {
                        setCurrentAtividade(prev => ({
                          ...prev,
                          executores: [...prev.executores, { ...maoObra, tipo: 'maoObra' }]
                        }))
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Adicionar mão de obra" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.maoDeObra.map((mao) => (
                        <SelectItem key={mao.id} value={mao.id.toString()}>
                          {mao.nomeCompleto} ({mao.funcaoDisplay})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Lista de executores selecionados */}
              {currentAtividade.executores.length > 0 && (
                <div className="mt-3">
                  <Label className="text-sm font-medium">Executores Selecionados:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentAtividade.executores.map((executor, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {executor.tipo === 'empreiteira' ? executor.nome : `${executor.nomeCompleto} (${executor.funcaoDisplay})`}
                        <button
                          onClick={() => {
                            setCurrentAtividade(prev => ({
                              ...prev,
                              executores: prev.executores.filter((_, i) => i !== index)
                            }))
                          }}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="observacoesAtividade">Observações</Label>
                <Textarea
                  id="observacoesAtividade"
                  value={currentAtividade.observacoes}
                  onChange={(e) => setCurrentAtividade(prev => ({ ...prev, observacoes: e.target.value }))}
                  placeholder="Observações sobre a atividade"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="fotoAtividade">Anexar Foto</Label>
                <Input
                  id="fotoAtividade"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      setCurrentAtividade(prev => ({ ...prev, foto: file }))
                    }
                  }}
                  className="mt-1"
                />
                {currentAtividade.foto && (
                  <p className="text-sm text-green-600 mt-1">
                    <Camera className="h-4 w-4 inline mr-1" />
                    Foto selecionada: {currentAtividade.foto.name}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 mb-4">
              {editingType === 'atividade' ? (
                <>
                  <Button onClick={saveEdit} className="bg-green-600 hover:bg-green-700">
                    Salvar Edição
                  </Button>
                  <Button onClick={cancelEdit} variant="outline">
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button onClick={addAtividade} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Atividade
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              {formData.atividades.map((item) => (
                <div key={item.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <span className="font-medium">{item.descricao}</span>
                      <div className="flex gap-2 mt-1">
                        {item.local && <Badge variant="outline">📍 {item.local}</Badge>}
                        <Badge variant={item.status === 'concluida' ? 'default' : item.status === 'em-andamento' ? 'secondary' : 'destructive'}>
                          {item.status}
                        </Badge>
                        {item.foto && <Badge variant="outline"><Camera className="h-3 w-3 mr-1" />Foto</Badge>}
                      </div>
                      {item.executores && item.executores.length > 0 && (
                        <div className="mt-2">
                          <span className="text-sm text-gray-600">Executores: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.executores.map((executor, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {executor.tipo === 'empreiteira' ? executor.nome : `${executor.nomeCompleto} (${executor.funcaoDisplay})`}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {item.observacoes && <p className="text-sm text-gray-600 mt-1">{item.observacoes}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(item, 'atividade')}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeItem(formData.atividades, item.id, 'atividades')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ocorrências e Observações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Ocorrências e Observações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="tipoOcorrencia">Tipo de Ocorrência</Label>
                <Select
                  value={currentOcorrencia.tipo}
                  onValueChange={(value) => setCurrentOcorrencia(prev => ({ ...prev, tipo: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acidente">Acidente</SelectItem>
                    <SelectItem value="atraso">Atraso</SelectItem>
                    <SelectItem value="problema-material">Problema com Material</SelectItem>
                    <SelectItem value="problema-equipamento">Problema com Equipamento</SelectItem>
                    <SelectItem value="condicoes-climaticas">Condições Climáticas</SelectItem>
                    <SelectItem value="visita-tecnica">Visita Técnica</SelectItem>
                    <SelectItem value="alteracao-projeto">Alteração de Projeto</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="prioridadeOcorrencia">Prioridade</Label>
                <Select
                  value={currentOcorrencia.prioridade}
                  onValueChange={(value) => setCurrentOcorrencia(prev => ({ ...prev, prioridade: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="critica">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="descricaoOcorrencia">Descrição da Ocorrência</Label>
                <Textarea
                  id="descricaoOcorrencia"
                  value={currentOcorrencia.descricao}
                  onChange={(e) => setCurrentOcorrencia(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Descreva a ocorrência detalhadamente"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="fotoOcorrencia">Anexar Foto</Label>
                <Input
                  id="fotoOcorrencia"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      setCurrentOcorrencia(prev => ({ ...prev, foto: file }))
                    }
                  }}
                  className="mt-1"
                />
                {currentOcorrencia.foto && (
                  <p className="text-sm text-green-600 mt-1">
                    <Camera className="h-4 w-4 inline mr-1" />
                    Foto selecionada: {currentOcorrencia.foto.name}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 mb-4">
              {editingType === 'ocorrencia' ? (
                <>
                  <Button onClick={saveEdit} className="bg-green-600 hover:bg-green-700">
                    Salvar Edição
                  </Button>
                  <Button onClick={cancelEdit} variant="outline">
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button onClick={addOcorrencia} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Ocorrência
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              {formData.ocorrencias.map((item) => (
                <div key={item.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex gap-2 mb-2">
                        <Badge variant="outline">{item.tipo}</Badge>
                        <Badge variant={
                          item.prioridade === 'critica' ? 'destructive' : 
                          item.prioridade === 'alta' ? 'destructive' : 
                          item.prioridade === 'media' ? 'secondary' : 'default'
                        }>
                          {item.prioridade}
                        </Badge>
                        {item.foto && <Badge variant="outline"><Camera className="h-3 w-3 mr-1" />Foto</Badge>}
                      </div>
                      <p className="text-sm">{item.descricao}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(item, 'ocorrencia')}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeItem(formData.ocorrencias, item.id, 'ocorrencias')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Material Recebido e Utilizado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Material Recebido e Utilizado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div>
                <Label htmlFor="nomeMaterial">Nome do Material</Label>
                <Input
                  id="nomeMaterial"
                  value={currentMaterial.nome}
                  onChange={(e) => setCurrentMaterial(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Cimento, Areia"
                />
              </div>
              <div>
                <Label htmlFor="quantidadeMaterial">Quantidade</Label>
                <Input
                  id="quantidadeMaterial"
                  type="number"
                  value={currentMaterial.quantidade}
                  onChange={(e) => setCurrentMaterial(prev => ({ ...prev, quantidade: e.target.value }))}
                  placeholder="Quantidade"
                />
              </div>
              <div>
                <Label htmlFor="unidadeMaterial">Unidade</Label>
                <Input
                  id="unidadeMaterial"
                  value={currentMaterial.unidade}
                  onChange={(e) => setCurrentMaterial(prev => ({ ...prev, unidade: e.target.value }))}
                  placeholder="Ex: kg, m³, un"
                />
              </div>
              <div>
                <Label htmlFor="fornecedorMaterial">Fornecedor</Label>
                <Input
                  id="fornecedorMaterial"
                  value={currentMaterial.fornecedor}
                  onChange={(e) => setCurrentMaterial(prev => ({ ...prev, fornecedor: e.target.value }))}
                  placeholder="Nome do fornecedor"
                />
              </div>
              <div>
                <Label htmlFor="tipoMaterial">Tipo</Label>
                <Select
                  value={currentMaterial.tipo}
                  onValueChange={(value) => setCurrentMaterial(prev => ({ ...prev, tipo: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recebido">Recebido</SelectItem>
                    <SelectItem value="utilizado">Utilizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex gap-2 mb-4">
              {editingType === 'material' ? (
                <>
                  <Button onClick={saveEdit} className="bg-green-600 hover:bg-green-700">
                    Salvar Edição
                  </Button>
                  <Button onClick={cancelEdit} variant="outline">
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button onClick={addMaterial} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Material
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              {formData.materiais.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div>
                    <span className="font-medium">{item.nome}</span>
                    <Badge variant="secondary" className="ml-2">{item.quantidade} {item.unidade}</Badge>
                    <Badge variant={item.tipo === 'recebido' ? 'default' : 'outline'} className="ml-2">
                      {item.tipo}
                    </Badge>
                    {item.fornecedor && <p className="text-sm text-gray-600 mt-1">Fornecedor: {item.fornecedor}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(item, 'material')}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItem(formData.materiais, item.id, 'materiais')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comentários Gerais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Comentários Gerais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="comentarios">Comentários e Observações Gerais</Label>
                <Textarea
                  id="comentarios"
                  value={formData.comentarios}
                  onChange={(e) => updateFormData('comentarios', e.target.value)}
                  placeholder="Adicione comentários gerais sobre o dia de trabalho, observações importantes, etc."
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botão para gerar PDF */}
        <Card>
          <CardContent className="pt-6">
            <Button 
              onClick={gerarPDF}
              className="w-full bg-green-600 hover:bg-green-700" 
              size="lg"
            >
              <Download className="h-5 w-5 mr-2" />
              Gerar PDF do Diário de Obra
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
