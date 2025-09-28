import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mxrqzltgqewomrbzfplo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14cnF6bHRncWV3b21yYnpmcGxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNzEzMzksImV4cCI6MjA3NDY0NzMzOX0.5xpUPNC9suFLO57CL4KH4ipRwKLflC2m-5DsIEJOHTA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Função para criar a tabela de diários se não existir
export const initializeDatabase = async () => {
  try {
    // Verificar se a tabela existe
    const { data, error } = await supabase
      .from('diarios_obra')
      .select('id')
      .limit(1)
    
    if (error && error.code === 'PGRST116') {
      // Tabela não existe, vamos criá-la
      console.log('Tabela não encontrada. Será necessário criar via SQL no Supabase Dashboard.')
      return false
    }
    
    return true
  } catch (error) {
    console.error('Erro ao verificar banco de dados:', error)
    return false
  }
}

// Função para salvar diário no Supabase
export const salvarDiarioSupabase = async (diarioData) => {
  try {
    const { data, error } = await supabase
      .from('diarios_obra')
      .insert([{
        numero_rdo: diarioData.numeroRDO,
        obra_selecionada: diarioData.obraSelecionada,
        responsavel_rdo: diarioData.responsavelRDO,
        data_relatorio: diarioData.dataRelatorio,
        dados_completos: diarioData,
        created_at: new Date().toISOString()
      }])
      .select()

    if (error) throw error

    return { success: true, data: data[0] }
  } catch (error) {
    console.error('Erro ao salvar diário:', error)
    return { success: false, error: error.message }
  }
}

// Função para carregar diários do Supabase
export const carregarDiariosSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('diarios_obra')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('Erro ao carregar diários:', error)
    return { success: false, error: error.message }
  }
}

// Função para carregar um diário específico
export const carregarDiarioSupabase = async (id) => {
  try {
    const { data, error } = await supabase
      .from('diarios_obra')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('Erro ao carregar diário:', error)
    return { success: false, error: error.message }
  }
}

// Função para deletar um diário
export const deletarDiarioSupabase = async (id) => {
  try {
    const { error } = await supabase
      .from('diarios_obra')
      .delete()
      .eq('id', id)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar diário:', error)
    return { success: false, error: error.message }
  }
}
