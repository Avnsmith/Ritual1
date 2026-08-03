import { ResearchReport, SourceCitation } from '@wowweb/shared';
import { SynthesizedResearch } from './ResearchAgent.js';

export class SummaryAgent {
  async generateReport(
    prompt: string,
    research: SynthesizedResearch,
    sources: SourceCitation[]
  ): Promise<ResearchReport> {
    const title = `Autonomous Research Report: ${prompt}`;
    const summary = `This report presents the verifiable autonomous web research executed by WowWeb for the request: "${prompt}". All source citations have been cryptographic hashed and registered on RitualNet.`;

    let markdown = `# ${title}\n\n`;
    markdown += `> **Confidence Score**: ${research.confidenceScore}%\n`;
    markdown += `> **Sources Analyzed**: ${sources.length} websites / documentation pages\n\n`;

    markdown += `## Executive Summary\n${summary}\n\n`;

    markdown += `## Key Findings\n`;
    research.keyFindings.forEach(f => {
      markdown += `- ${f}\n`;
    });
    markdown += `\n`;

    markdown += `## Architecture Comparison Matrix\n\n`;
    markdown += `| Feature | WowWeb (RitualNet) | Standard AI Chatbot | Web2 Browser Extension |\n`;
    markdown += `| :--- | :--- | :--- | :--- |\n`;
    research.comparisonTable.forEach(row => {
      markdown += `| **${row.feature}** | ${row['WowWeb (RitualNet)']} | ${row['Standard AI Chatbot']} | ${row['Web2 Browser Extension']} |\n`;
    });
    markdown += `\n`;

    markdown += `## Advantages & Considerations\n\n`;
    markdown += `### Key Advantages\n`;
    research.pros.forEach(p => markdown += `- ✅ ${p}\n`);
    markdown += `\n### Strategic Considerations\n`;
    research.cons.forEach(c => markdown += `- ⚠️ ${c}\n`);
    markdown += `\n`;

    markdown += `## Verified Sources & Citations\n\n`;
    sources.forEach((src, idx) => {
      markdown += `### ${idx + 1}. [${src.title}](${src.url})\n`;
      markdown += `- **URL**: \`${src.url}\`  \n`;
      markdown += `- **Content Hash**: \`${src.contentHash}\`  \n`;
      markdown += `- **Excerpt**: "${src.snippet}"\n\n`;
    });

    return {
      title,
      summary,
      keyFindings: research.keyFindings,
      pros: research.pros,
      cons: research.cons,
      comparisonTable: research.comparisonTable,
      confidenceScore: research.confidenceScore,
      sources,
      rawMarkdown: markdown,
    };
  }
}
