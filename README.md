# Diário de Obra Digital - IPEX Construtora

Sistema completo para registro e controle de atividades diárias da obra desenvolvido para a IPEX Construtora.

## 🏗️ Funcionalidades Principais

### ✅ Dados da Obra
- **Seleção de obras pré-definidas**: 7 obras da IPEX Construtora
- **Geração automática do número RDO**: Formato DDMMYYYY baseado na data
- **Campo para responsável pelo preenchimento do RDO**

### ⏰ Horário de Trabalho
- Registro de horários de início e fim
- Controle de intervalos
- Cálculo automático de horas trabalhadas

### 🌤️ Condições Climáticas
- Registro por período (Manhã, Tarde, Noite)
- Indicação de período praticável
- Opções: Ensolarado, Nublado, Chuvoso, Ventoso

### 👥 Empreiteiras
- Nome da empresa
- Número de colaboradores
- Responsável
- **Funcionalidade de edição completa**

### 🔧 Mão de Obra
- **Seleção de função com opção "Outro"**
- Nome completo do trabalhador
- Observações
- **Funcionalidade de edição completa**

### ⚙️ Equipamentos
- **Seleção de equipamento com opção "Outro"**
- Quantidade e status
- Observações
- **Funcionalidade de edição completa**

### 📋 Atividades Executadas
- **Múltiplos executores por atividade**
- Seleção de empreiteiras e mão de obra
- Status da atividade
- **Anexo de fotos**
- **Funcionalidade de edição completa**

### ⚠️ Ocorrências e Observações
- Tipos de ocorrência (Acidente, Atraso, etc.)
- Níveis de prioridade
- **Anexo de fotos**
- **Funcionalidade de edição completa**

### 📦 Material Recebido e Utilizado
- Controle de materiais
- Fornecedores
- Quantidades e unidades
- **Funcionalidade de edição completa**

### 💬 Comentários Gerais
- Campo livre para observações
- Integração com anexos

## 🎨 Branding IPEX
- **Logo oficial da IPEX Construtora**
- **Cores corporativas**: Verde lima (#b8d332)
- **Design responsivo e moderno**
- **Animações suaves e micro-interações**

## 📄 Geração de PDF
- **PDF completo com todas as seções**
- **Integração de fotos anexadas**
- **Layout profissional com branding IPEX**
- **Nome automático do arquivo**: `Diario_Obra_RDO_[NUMERO]_[DATA].pdf`

## 🛠️ Tecnologias Utilizadas
- **React 19.1.0**
- **Vite 6.3.5**
- **Tailwind CSS 4.1.7**
- **Shadcn/UI Components**
- **Lucide React Icons**
- **jsPDF** para geração de PDF
- **html2canvas** para captura de imagens

## 🚀 Como Executar

### Desenvolvimento
```bash
pnpm install
pnpm run dev
```

### Build para Produção
```bash
pnpm run build
```

## 📱 Responsividade
- **Design mobile-first**
- **Adaptação automática para tablets e desktops**
- **Interface otimizada para uso em campo**

## 🔧 Funcionalidades Avançadas
- **Edição de todos os itens adicionados**
- **Múltiplos executores por atividade**
- **Upload e integração de fotos no PDF**
- **Validação de formulários**
- **Persistência local dos dados**
- **Interface intuitiva e profissional**

## 📋 Obras Pré-definidas
1. New York Lofts - Rua São Genaro 100, São Francisco, Camboriú - SC
2. Carpe Diem Residencial - Rua Santa Terezinha, 250 - São Francisco de Assis, Camboriú - SC
3. Manhattan Lofts - Rua Miguel 235, Bairro São Francisco, Camboriú - SC
4. Passeio Ipex - Av. Santo Amaro, 1330 - Bairro São Francisco, Camboriú - SC
5. Green Tower - São Miguel 320 Rua Bairro São Francisco, Camboriú - SC
6. Privilege Smart - Rua São Genaro 10, São Francisco, Camboriú – SC
7. Escritório Ipex - Rua Santo Amaro,1330 , São Francisco, Camboriú – SC

---

**Desenvolvido para IPEX Construtora** - Sistema profissional de gestão de diário de obra com todas as funcionalidades solicitadas.
