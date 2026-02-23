/**
 * PDF Generator Module - Lazy Loaded
 * Gera PDF do guia de orações das 3 Âncoras
 */

const PdfGenerator = {
  // URL do CDN do jsPDF (carregado sob demanda)
  JSPDF_URL: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  
  // Estado de carregamento
  isLoading: false,
  isLoaded: false,
  
  /**
   * Carrega o jsPDF dinamicamente (Lazy Load)
   * @returns {Promise} Promise resolvida quando a lib estiver carregada
   */
  loadLibrary() {
    return new Promise((resolve, reject) => {
      // Se já está carregado, resolve imediatamente
      if (window.jspdf && window.jspdf.jsPDF) {
        this.isLoaded = true;
        resolve(window.jspdf.jsPDF);
        return;
      }
      
      // Se já está carregando, aguarda
      if (this.isLoading) {
        const checkInterval = setInterval(() => {
          if (window.jspdf && window.jspdf.jsPDF) {
            clearInterval(checkInterval);
            this.isLoaded = true;
            resolve(window.jspdf.jsPDF);
          }
        }, 100);
        return;
      }
      
      this.isLoading = true;
      
      // Cria script element para carregar jsPDF
      const script = document.createElement('script');
      script.src = this.JSPDF_URL;
      script.async = true;
      script.onload = () => {
        this.isLoading = false;
        this.isLoaded = true;
        resolve(window.jspdf.jsPDF);
      };
      script.onerror = () => {
        this.isLoading = false;
        reject(new Error('Falha ao carregar jsPDF'));
      };
      
      document.head.appendChild(script);
    });
  },
  
  /**
   * Conteúdo dos capítulos para o PDF
   */
  getContent() {
    return {
      title: 'A Regra das 3 Âncoras',
      subtitle: 'Guia de Orações Diárias',
      chapters: [
        {
          title: 'Âncora da Manhã (O Despertar na Graça)',
          verse: '"Faze-me ouvir do teu amor leal pela manhã, pois em ti confio." (Salmo 143, 8)',
          prayers: [
            {
              title: 'Versão 2 Minutos - Oração de Oferecimento',
              text: '"Senhor, no silêncio deste dia que amanhece, eu Te entrego o meu cansaço, os meus medos e as minhas expectativas. Liberta-me da necessidade de ser perfeito hoje. Que eu caminhe amparado pela Tua graça, oferecendo o meu trabalho, a minha família e as minhas fragilidades ao Teu cuidado amoroso. Amém."'
            },
            {
              title: 'Versão 7 Minutos',
              text: '1. Faça a oração acima.\n2. Em seguida, abra a sua Bíblia no Salmo 23 e leia-o lentamente.\n3. Termine com 1 minuto de silêncio absoluto, apenas sentindo a presença de Deus ao seu lado.'
            }
          ]
        },
        {
          title: 'Âncora do Meio-Dia (A Pausa do Descanso)',
          verse: '"Orem continuamente. Deem graças em todas as circunstâncias." (1 Tessalonicenses 5, 17-18)',
          prayers: [
            {
              title: 'Versão 1 Minuto - A Jaculatória de Alívio',
              text: '"Jesus, manso e humilde de coração, fazei o meu coração semelhante ao Vosso. Que no meio da agitação e do barulho destas horas, eu encontre descanso imediato na Tua graça."'
            },
            {
              title: 'Versão 5 Minutos',
              text: '1. Faça a jaculatória acima.\n2. Depois, leia um único versículo do Evangelho do dia.\n3. Se a sua manhã foi difícil e você falhou nos seus propósitos, não se condene.'
            }
          ]
        },
        {
          title: 'Âncora da Noite (O Pouso Seguro)',
          verse: '"Graças ao grande amor do Senhor é que não somos consumidos, pois as suas misericórdias são inesgotáveis." (Lamentações 3, 22-23)',
          prayers: [
            {
              title: 'Versão 2 Minutos - Ato de Contrição Curativo',
              text: '"Meu Deus, eu Te agradeço por ter me sustentado até aqui. Peço perdão com o coração tranquilo pelas vezes em que tropecei, perdi a paciência ou duvidei do Teu cuidado hoje. Eu não me escondo na culpa; eu me lanço agora na Tua infinita misericórdia, sabendo que o Teu perdão me abraça. Amém."'
            },
            {
              title: 'Versão 7 Minutos - Exame de Consciência Gentil',
              text: 'Refleta sem peso sobre estas 3 perguntas:\n\n1. Onde eu percebi um pequeno cuidado de Deus por mim hoje?\n2. Em qual momento eu deixei a ansiedade roubar minha paz?\n3. Como posso recomeçar amanhã de forma mais leve?'
            }
          ]
        }
      ],
      closing: 'Que a graça do Senhor Jesus Cristo, o amor de Deus e a comunhão do Espírito Santo estejam com você. (2 Coríntios 13, 13)'
    };
  },
  
  /**
   * Gera e faz download do PDF
   * @param {Function} onProgress - Callback para atualização de progresso
   * @param {Function} onComplete - Callback quando completar
   * @param {Function} onError - Callback em caso de erro
   */
  async generate(onProgress = () => {}, onComplete = () => {}, onError = () => {}) {
    try {
      onProgress({ status: 'loading', message: 'Carregando biblioteca...' });
      
      // Lazy load da biblioteca
      const { jsPDF } = await this.loadLibrary();
      
      onProgress({ status: 'generating', message: 'Gerando PDF...' });
      
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const content = this.getContent();
      let yPos = 20;
      const pageHeight = 280;
      const margin = 20;
      
      // Configurações de fonte
      doc.setFont('helvetica');
      
      // Título principal
      doc.setFontSize(20);
      doc.setTextColor(198, 168, 124); // Cor gold
      doc.text(content.title, margin, yPos);
      yPos += 10;
      
      // Subtítulo
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(content.subtitle, margin, yPos);
      yPos += 15;
      
      // Linha divisória
      doc.setDrawColor(198, 168, 124);
      doc.line(margin, yPos, 190, yPos);
      yPos += 10;
      
      // Conteúdo dos capítulos
      content.chapters.forEach((chapter, index) => {
        // Verifica se precisa de nova página
        if (yPos > pageHeight - 40) {
          doc.addPage();
          yPos = 20;
        }
        
        // Título do capítulo
        doc.setFontSize(14);
        doc.setTextColor(40, 40, 40);
        doc.setFont(undefined, 'bold');
        doc.text(`Capítulo ${index + 1}: ${chapter.title}`, margin, yPos);
        yPos += 8;
        
        // Versículo
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.setFont(undefined, 'italic');
        const verseLines = doc.splitTextToSize(chapter.verse, 170);
        doc.text(verseLines, margin, yPos);
        yPos += (verseLines.length * 4) + 6;
        
        // Orações
        doc.setFont(undefined, 'normal');
        chapter.prayers.forEach(prayer => {
          if (yPos > pageHeight - 30) {
            doc.addPage();
            yPos = 20;
          }
          
          // Título da oração
          doc.setFontSize(11);
          doc.setTextColor(198, 168, 124);
          doc.setFont(undefined, 'bold');
          doc.text(prayer.title, margin, yPos);
          yPos += 6;
          
          // Texto da oração
          doc.setFontSize(10);
          doc.setTextColor(60, 60, 60);
          doc.setFont(undefined, 'normal');
          const textLines = doc.splitTextToSize(prayer.text, 170);
          doc.text(textLines, margin, yPos);
          yPos += (textLines.length * 5) + 8;
        });
        
        yPos += 5;
      });
      
      // Página final
      if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = 20;
      }
      
      // Linha divisória
      doc.setDrawColor(198, 168, 124);
      doc.line(margin, yPos, 190, yPos);
      yPos += 10;
      
      // Texto de encerramento
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.setFont(undefined, 'italic');
      const closingLines = doc.splitTextToSize(content.closing, 170);
      doc.text(closingLines, margin, yPos);
      
      // Download
      const filename = `3-ancoras-guia-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      onComplete({ filename });
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      onError(error.message || 'Erro desconhecido ao gerar PDF');
    }
  }
};

// Exporta para uso global
window.PdfGenerator = PdfGenerator;
